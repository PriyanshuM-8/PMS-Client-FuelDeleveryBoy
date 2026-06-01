import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { api } from "../utils/api";
import Swal from "sweetalert2";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const pendingAlarmRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/sound/booking.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    // Unlock audio on first user interaction (browser autoplay policy fix)
    const unlock = () => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        setAudioUnlocked(true);
        // If alarm was pending, play it now
        if (pendingAlarmRef.current) {
          audio.play().catch(() => {});
          pendingAlarmRef.current = null;
        }
      }).catch(() => {});
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
    };

    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("click", unlock, { once: true });

    return () => {
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
    };
  }, []);

  const playAlarm = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    const playPromise = audioRef.current.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Audio not unlocked yet — mark as pending
        pendingAlarmRef.current = true;
      });
    }
  }, []);

  const stopAlarm = useCallback(() => {
    pendingAlarmRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const dismissAlert = useCallback(() => {
    stopAlarm();
    setNewOrderAlert(null);
  }, [stopAlarm]);

  useEffect(() => {
    if (!deliveryBoy) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io("/", { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", deliveryBoy._id);
    });

    socket.on("new_order_assigned", (data) => {
      playAlarm();
      setNewOrderAlert(data);
    });

    socket.on("booking_cancelled", (data) => {
      Swal.fire({
        icon: "warning",
        title: "Booking Cancelled",
        text: "The customer has cancelled the booking.",
        confirmButtonText: "OK"
      });
    });

    return () => socket.disconnect();
  }, [deliveryBoy, playAlarm]);

  useEffect(() => {
    const stored = localStorage.getItem("db_info");
    if (stored) setDeliveryBoy(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    const data = await api("/delivery-boy/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    });
    localStorage.setItem("db_token", data.token);
    localStorage.setItem("db_info", JSON.stringify(data.deliveryBoy));
    setDeliveryBoy(data.deliveryBoy);
    return data;
  };

  const logout = () => {
    stopAlarm();
    socketRef.current?.disconnect();
    localStorage.removeItem("db_token");
    localStorage.removeItem("db_info");
    setDeliveryBoy(null);
  };

  return (
    <AuthContext.Provider value={{ deliveryBoy, loading, login, logout, newOrderAlert, dismissAlert }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
