import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Fuel, MapPin, X, Navigation } from "lucide-react";

export default function NewOrderAlert() {
  const { newOrderAlert, dismissAlert } = useAuth();
  const navigate = useNavigate();

  if (!newOrderAlert) return null;

  const handleView = () => {
    dismissAlert();
    navigate(`/order/${newOrderAlert.bookingId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Pulsing ring animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-32 h-32 rounded-full border-4 border-orange-500/30 animate-ping" />
      </div>

      <div className="w-full max-w-sm bg-slate-800 border border-orange-500/50 rounded-3xl shadow-2xl shadow-orange-500/20 overflow-hidden animate-bounce-once">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white font-bold text-sm">New Order Assigned!</span>
          </div>
          <button onClick={dismissAlert} className="text-white/80 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Customer & Fuel Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <Fuel size={22} className="text-orange-400" />
            </div>
            <div>
              <p className="text-white font-bold text-base">
                {newOrderAlert.customerName || "Customer"}
              </p>
              <p className="text-orange-400 text-sm font-semibold capitalize">
                {newOrderAlert.fuelType} • {newOrderAlert.quantity}L • ₹{newOrderAlert.amount}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-slate-700/50 rounded-2xl px-4 py-3 flex items-start gap-2">
            <MapPin size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300 text-sm leading-relaxed">
              {newOrderAlert.address || "Address not available"}
            </p>
          </div>

          {/* ETA */}
          {newOrderAlert.estimatedArrival && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
              <Navigation size={14} className="text-blue-400" />
              <p className="text-blue-400 text-xs font-medium">
                ETA: {newOrderAlert.estimatedArrival} minutes
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={dismissAlert}
              className="flex-1 py-3 rounded-2xl border border-slate-600 text-slate-400 text-sm font-semibold hover:bg-slate-700 transition active:scale-95"
            >
              Dismiss
            </button>
            <button
              onClick={handleView}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-500/30 hover:opacity-90 transition active:scale-95"
            >
              View Order →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
