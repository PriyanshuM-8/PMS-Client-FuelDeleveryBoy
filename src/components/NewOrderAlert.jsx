import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Fuel, MapPin, X, Navigation, Zap } from "lucide-react";

export default function NewOrderAlert() {
  const { newOrderAlert, dismissAlert } = useAuth();
  const navigate = useNavigate();

  if (!newOrderAlert) return null;

  const handleView = () => {
    dismissAlert();
    navigate(`/order/${newOrderAlert.bookingId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full border-2 border-orange-500/10 animate-ping" />
        <div className="absolute w-48 h-48 rounded-full border-2 border-orange-500/20 animate-pulse" />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-900/95 backdrop-blur-2xl border border-orange-500/25 rounded-[2rem] shadow-2xl shadow-orange-500/20 overflow-hidden relative z-10 animate-bounce">

        {/* Top bar */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="text-white font-extrabold tracking-wider text-sm uppercase">New Order!</span>
          </div>
          <button onClick={dismissAlert} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/25 transition-colors">
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Customer & Fuel */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/15 to-red-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
              <Fuel size={26} className="text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-extrabold text-lg tracking-tight truncate">
                {newOrderAlert.customerName || "Customer"}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-orange-400 text-sm font-bold">{newOrderAlert.fuelType}</span>
                <span className="text-white/20">•</span>
                <span className="text-orange-400 text-sm font-bold">{newOrderAlert.quantity}L</span>
                <span className="text-white/20">•</span>
                <span className="text-emerald-400 text-sm font-extrabold">₹{newOrderAlert.amount}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/15 shrink-0 mt-0.5">
              <MapPin size={16} className="text-red-400" />
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              {newOrderAlert.address || "Address not available"}
            </p>
          </div>

          {/* ETA */}
          {newOrderAlert.estimatedArrival && (
            <div className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-blue-500/8 border border-blue-500/15">
              <Navigation size={16} className="text-blue-400" />
              <p className="text-blue-400 text-sm font-bold tracking-wide">
                ETA: {newOrderAlert.estimatedArrival} min
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={dismissAlert}
              className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm font-bold tracking-wide hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              Dismiss
            </button>
            <button
              onClick={handleView}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-extrabold tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:brightness-110 transition-all active:scale-95"
            >
              View Order →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
