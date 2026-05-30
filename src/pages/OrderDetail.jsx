import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import {
  ArrowLeft, MapPin, Phone, Fuel, Navigation,
  CheckCircle, IndianRupee, Banknote, QrCode, Loader2,
  Clock, Truck, CreditCard
} from "lucide-react";
import Swal from "sweetalert2";

const STEPS = ["assigned", "in_progress", "reached", "payment_pending", "completed"];

const stepIndex = (status) => STEPS.indexOf(status);

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState(null);

  const fetchOrder = async () => {
    try {
      const data = await api(`/delivery-boy/order/${id}`);
      setOrder(data.data);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message, background: "#06060a", color: "#f8fafc", confirmButtonColor: "#f97316" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const doAction = async (endpoint, successMsg, confirmMsg) => {
    if (confirmMsg) {
      const result = await Swal.fire({
        title: "Confirm",
        text: confirmMsg,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#334155",
        background: "#06060a",
        color: "#f8fafc",
        confirmButtonText: "Yes, Confirm",
        customClass: { popup: 'border border-white/10 rounded-3xl' }
      });
      if (!result.isConfirmed) return;
    }
    setActionLoading(true);
    try {
      await api(endpoint, { method: "PATCH" });
      await fetchOrder();
      Swal.fire({ icon: "success", title: successMsg, timer: 1500, showConfirmButton: false, background: "#06060a", color: "#f8fafc", customClass: { popup: 'border border-white/10 rounded-3xl' } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.message, background: "#06060a", color: "#f8fafc", customClass: { popup: 'border border-white/10 rounded-3xl' } });
    } finally {
      setActionLoading(false);
    }
  };

  const handleNavigate = () => {
    if (!order?.address?.location?.coordinates) return;
    const [lng, lat] = order.address.location.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const handleCashPayment = async () => {
    await doAction(
      `/delivery-boy/order/${id}/cash-received`,
      "Cash Received!",
      `Confirm cash payment of ₹${order?.amount} received from customer?`
    );
    setPaymentMode(null);
  };

  const handleFuelDelivered = async () => {
    await doAction(
      `/delivery-boy/order/${id}/fuel-delivered`,
      "Fuel Delivered! 🎉",
      "Confirm that fuel has been delivered to the customer?"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-orange-500/10 blur-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const status = order.status;
  const coords = order.address?.location?.coordinates;

  return (
    <div className="min-h-screen bg-[#06060a] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.18),rgba(120,53,15,0.05),transparent)] pb-10 text-slate-200">

      {/* ─── Sticky Glassmorphism Header ─── */}
      <div className="sticky top-0 z-50 bg-[#06060a]/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-extrabold text-lg tracking-tight">Order Details</h1>
            <p className="text-orange-400 font-semibold text-xs tracking-[0.15em] uppercase mt-0.5 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
              #{id.slice(-8)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-5">
        {/* ─── Progress Stepper ─── */}
        <ProgressBar status={status} />

        {/* ─── Customer Card ─── */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md group">
          {/* Decorative glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/[0.07] rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-700" />

          {/* Section header */}
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <h2 className="text-slate-500 text-[10px] font-extrabold uppercase tracking-[0.25em]">Customer</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/25 border border-white/20 shrink-0">
              {order.customer?.name?.[0]?.toUpperCase() || "C"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-[17px] tracking-tight truncate">{order.customer?.name}</p>
              <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-1.5">
                <Phone size={12} className="text-slate-500" />
                {order.customer?.phone}
              </p>
            </div>
            {/* Call button with animated ring */}
            <a
              href={`tel:${order.customer?.phone}`}
              className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/25 group/call shrink-0"
            >
              <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/40 group-hover/call:scale-110 group-hover/call:opacity-0 transition-all duration-500" />
              <Phone size={20} fill="currentColor" />
            </a>
          </div>
        </div>

        {/* ─── Location Card ─── */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md group">
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-blue-500/[0.06] rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700" />

          <div className="flex items-center gap-3 mb-5 relative z-10">
            <h2 className="text-slate-500 text-[10px] font-extrabold uppercase tracking-[0.25em]">Delivery Location</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="flex items-start gap-4 relative z-10">
            <div className="mt-0.5 w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed font-medium">{order.address?.full}</p>
          </div>

          {coords && (
            <button
              onClick={handleNavigate}
              className="mt-5 w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-500/20 text-blue-400 rounded-2xl py-3.5 text-sm font-bold hover:from-blue-500/25 hover:to-cyan-500/25 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all duration-300 active:scale-[0.97] relative z-10 group/nav"
            >
              <Navigation size={18} className="group-hover/nav:animate-pulse" />
              Open in Google Maps
            </button>
          )}
        </div>

        {/* ─── Fuel Details Card ─── */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <h2 className="text-slate-500 text-[10px] font-extrabold uppercase tracking-[0.25em]">Order Summary</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          {/* Decorative fuel gauge element */}
          <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full border-[6px] border-orange-500/[0.08] opacity-50" />
          <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full border-4 border-orange-500/[0.12] opacity-50" />

          <div className="grid grid-cols-3 gap-3 relative z-10">
            <InfoTile icon={<Fuel size={20} className="text-orange-400" />} label="Fuel Type" value={order.fuelDetails?.fuelType?.toUpperCase()} />
            <InfoTile icon={<span className="text-orange-400 text-lg font-black">L</span>} label="Quantity" value={`${order.fuelDetails?.quantity} L`} />
            <InfoTile icon={<IndianRupee size={20} className="text-emerald-400" />} label="Amount" value={`₹${order.amount}`} highlight />
          </div>
        </div>

        {/* ─── Action Section ─── */}
        <ActionSection
          status={status}
          actionLoading={actionLoading}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          order={order}
          onMarkInProgress={() => doAction(`/delivery-boy/order/${id}/start`, "On the Way!")}
          onArrived={() => doAction(`/delivery-boy/order/${id}/arrived`, "Marked as Arrived!", "Confirm you have reached the customer location?")}
          onCashPayment={handleCashPayment}
          onFuelDelivered={handleFuelDelivered}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   InfoTile Component
   ═══════════════════════════════════════════ */
function InfoTile({ icon, label, value, highlight }) {
  return (
    <div className={`relative rounded-2xl p-4 text-center border transition-all duration-300 ${
      highlight
        ? "bg-emerald-500/[0.08] border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        : "bg-white/[0.03] border-white/[0.06]"
    }`}>
      {highlight && <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 blur-sm" />}
      <div className="relative z-10">
        <div className="flex justify-center mb-2.5">{icon}</div>
        <p className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">{label}</p>
        <p className={`font-black ${highlight ? "text-emerald-400 text-xl drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "text-white text-sm"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ProgressBar (Stepper) Component
   ═══════════════════════════════════════════ */
function ProgressBar({ status }) {
  const steps = [
    { key: "assigned", label: "Assigned", icon: Clock },
    { key: "in_progress", label: "On Way", icon: Truck },
    { key: "reached", label: "Arrived", icon: MapPin },
    { key: "payment_pending", label: "Payment", icon: CreditCard },
    { key: "completed", label: "Done", icon: CheckCircle },
  ];
  const current = stepIndex(status);

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-5 pb-4 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-orange-500/[0.06] blur-3xl rounded-full" />

      <div className="flex items-start justify-between relative z-10">
        {steps.map((step, i) => {
          const isCompleted = i < current;
          const isActive = i === current;
          const isPending = i > current;
          const isLast = i === steps.length - 1;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex items-start flex-1">
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div className="relative">
                  {/* Pulsing glow ring for active step */}
                  {isActive && (
                    <>
                      <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-orange-500/30 to-amber-500/30 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 animate-pulse" />
                    </>
                  )}
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${
                    isCompleted
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_0_16px_rgba(249,115,22,0.5)] border border-white/25"
                      : isActive
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] border-2 border-white/30 scale-110"
                      : "bg-white/[0.05] text-slate-600 border border-white/[0.08]"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={18} strokeWidth={3} />
                    ) : (
                      <StepIcon size={isActive ? 18 : 16} strokeWidth={isActive ? 2.5 : 2} />
                    )}
                  </div>
                </div>
                {/* Label */}
                <span className={`text-[9px] font-extrabold uppercase tracking-wider mt-3 text-center leading-tight transition-all duration-500 ${
                  isCompleted ? "text-orange-400/80"
                  : isActive ? "text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                  : "text-slate-600"
                }`}>
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-1.5 mt-5 rounded-full overflow-hidden bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isCompleted
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 w-full shadow-[0_0_6px_rgba(249,115,22,0.4)]"
                        : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ActionSection Component
   ═══════════════════════════════════════════ */
function ActionSection({ status, actionLoading, paymentMode, setPaymentMode, order, onMarkInProgress, onArrived, onCashPayment, onFuelDelivered }) {

  /* ── Completed ── */
  if (status === "completed") {
    return (
      <div className="bg-emerald-500/[0.08] border border-emerald-500/20 rounded-3xl p-8 text-center shadow-[0_0_40px_rgba(16,185,129,0.12)] relative overflow-hidden">
        {/* Confetti-style decorative elements */}
        <div className="absolute top-3 left-6 w-2 h-2 rounded-full bg-emerald-400/40 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }} />
        <div className="absolute top-8 right-10 w-1.5 h-1.5 rounded-full bg-amber-400/40 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1.8s' }} />
        <div className="absolute top-5 left-1/4 w-1 h-3 rounded-full bg-blue-400/30 rotate-45 animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2.2s' }} />
        <div className="absolute top-12 right-1/4 w-1 h-3 rounded-full bg-purple-400/30 -rotate-45 animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2.4s' }} />
        <div className="absolute bottom-6 left-8 w-2 h-1 rounded-full bg-orange-400/30 animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '2.1s' }} />
        <div className="absolute bottom-10 right-12 w-1.5 h-1.5 rounded-full bg-emerald-300/30 animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '1.9s' }} />
        <div className="absolute top-4 right-1/3 w-1 h-1 rounded-full bg-yellow-400/50 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-4 left-1/3 w-1 h-1 rounded-full bg-teal-400/50 animate-ping" style={{ animationDuration: '2.5s' }} />

        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl -mr-12 -mt-12" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10" />

        {/* Check icon with glow */}
        <div className="relative w-24 h-24 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
            <CheckCircle size={48} className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
          </div>
        </div>
        <p className="text-emerald-400 font-black text-2xl tracking-tight relative z-10">Delivery Completed!</p>
        <p className="text-emerald-400/70 font-medium text-sm mt-2 relative z-10">Excellent job! Order was successfully delivered.</p>
      </div>
    );
  }

  /* ── Assigned → Start Delivery ── */
  if (status === "assigned") {
    return (
      <ActionBtn loading={actionLoading} onClick={onMarkInProgress} color="blue" icon={<Navigation size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}>
        Start Delivery
      </ActionBtn>
    );
  }

  /* ── In Progress → Arrived ── */
  if (status === "in_progress") {
    return (
      <ActionBtn loading={actionLoading} onClick={onArrived} color="purple" icon={<MapPin size={20} />}>
        I've Arrived at Location
      </ActionBtn>
    );
  }

  /* ── Reached → Payment ── */
  if (status === "reached") {
    if (!paymentMode) {
      return (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/[0.06] rounded-full blur-3xl" />

          <div className="text-center mb-6 relative z-10">
            <p className="text-white font-bold text-lg tracking-tight">Select Payment Method</p>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Amount to Collect:
              <span className="inline-block ml-2 text-emerald-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">₹{order.amount}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            {/* UPI Card */}
            <button
              onClick={() => setPaymentMode("upi")}
              className="group flex flex-col items-center gap-3.5 bg-purple-500/[0.08] border border-purple-500/20 text-purple-400 rounded-2xl py-7 hover:bg-purple-500/15 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:border-purple-500/30 transition-all duration-300 active:scale-[0.97]"
            >
              <div className="p-3.5 bg-purple-500/15 rounded-2xl group-hover:scale-110 group-hover:bg-purple-500/25 transition-all duration-300 shadow-lg shadow-purple-500/10">
                <QrCode size={30} />
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">UPI Payment</span>
            </button>

            {/* Cash Card */}
            <button
              onClick={() => setPaymentMode("cash")}
              className="group flex flex-col items-center gap-3.5 bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 rounded-2xl py-7 hover:bg-emerald-500/15 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:border-emerald-500/30 transition-all duration-300 active:scale-[0.97]"
            >
              <div className="p-3.5 bg-emerald-500/15 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all duration-300 shadow-lg shadow-emerald-500/10">
                <Banknote size={30} />
              </div>
              <span className="text-sm font-bold tracking-wide uppercase">Cash Payment</span>
            </button>
          </div>
        </div>
      );
    }

    if (paymentMode === "upi") {
      return <UPIPaymentPanel order={order} onBack={() => setPaymentMode(null)} />;
    }

    if (paymentMode === "cash") {
      return (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6">
          <div className="absolute -top-14 -right-14 w-40 h-40 bg-emerald-500/[0.08] rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/[0.06] rounded-full blur-3xl" />

          <div className="text-center relative z-10">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-emerald-500/15 blur-lg animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500/15 to-green-500/15 rounded-full flex items-center justify-center border border-emerald-500/25">
                <Banknote size={36} className="text-emerald-400" />
              </div>
            </div>
            <p className="text-white font-bold text-lg tracking-tight">Cash Payment</p>
            <p className="text-5xl font-black text-emerald-400 mt-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">₹{order.amount}</p>
            <p className="text-slate-400 font-medium text-sm mt-3">Please collect the exact cash from customer</p>
          </div>
          <ActionBtn loading={actionLoading} onClick={onCashPayment} color="green" icon={<CheckCircle size={20} />}>
            Cash Received Successfully
          </ActionBtn>
          <button onClick={() => setPaymentMode(null)} className="w-full text-slate-400 text-sm font-bold py-2 hover:text-white transition-colors relative z-10">
            ← Back to Payment Methods
          </button>
        </div>
      );
    }
  }

  /* ── Payment Pending → Deliver Fuel ── */
  if (status === "payment_pending") {
    return (
      <div className="space-y-4">
        <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-3xl p-6 text-center shadow-[0_0_25px_rgba(245,158,11,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/15 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl -ml-6 -mb-6" />
          <p className="text-amber-400 font-bold text-lg tracking-tight relative z-10">Payment Verified!</p>
          <p className="text-amber-400/70 font-medium text-sm mt-1.5 relative z-10">You can now proceed to deliver the fuel.</p>
        </div>
        <ActionBtn loading={actionLoading} onClick={onFuelDelivered} color="orange" icon={<Fuel size={20} />}>
          Confirm Fuel Delivered
        </ActionBtn>
      </div>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════
   UPIPaymentPanel Component
   ═══════════════════════════════════════════ */
function UPIPaymentPanel({ order, onBack }) {
  const upiId = order.pump?.upiId || "petrocareX@upi";
  const amount = order.amount;
  const upiLink = `upi://pay?pa=${upiId}&pn=PM+PetroCareX&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Decorative glow blobs */}
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-purple-500/[0.08] rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-purple-500/[0.06] rounded-full blur-3xl" />

      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/15 to-fuchsia-500/15 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-purple-500/20 shadow-lg shadow-purple-500/10">
          <QrCode size={32} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
        </div>
        <p className="text-white font-bold text-lg tracking-tight">UPI Payment Scan</p>
        <p className="text-4xl font-black text-emerald-400 mt-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">₹{amount}</p>
      </div>

      {/* QR Code with purple glow */}
      <div className="flex justify-center mb-6 relative z-10">
        <div className="relative">
          <div className="absolute -inset-3 bg-purple-500/15 rounded-3xl blur-xl" />
          <div className="relative bg-white p-4 rounded-3xl shadow-[0_0_35px_rgba(168,85,247,0.25)]">
            <img src={qrUrl} alt="UPI QR" width={200} height={200} className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* UPI ID copyable */}
      <div className="bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 mb-4 relative z-10 text-center">
        <p className="text-slate-500 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-1.5">UPI ID (Pump Admin)</p>
        <p className="text-white font-mono text-base font-black tracking-wider select-all cursor-text">{upiId}</p>
      </div>

      {/* Warning */}
      <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl px-4 py-3.5 mb-5 relative z-10">
        <p className="text-amber-400 text-xs font-bold text-center leading-relaxed">
          ⚠️ Show this QR to the customer. <br /> Do NOT share your personal UPI ID.
        </p>
      </div>

      <button onClick={onBack} className="w-full text-slate-400 text-sm font-bold py-2 hover:text-white transition-colors duration-300 relative z-10">
        ← Back to Payment Methods
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ActionBtn Component
   ═══════════════════════════════════════════ */
function ActionBtn({ children, onClick, loading, color, icon }) {
  const colors = {
    blue: "from-blue-500 to-indigo-600 shadow-[0_4px_25px_rgba(59,130,246,0.3)] border-blue-400/20 hover:shadow-[0_4px_35px_rgba(59,130,246,0.45)]",
    purple: "from-purple-500 to-fuchsia-600 shadow-[0_4px_25px_rgba(168,85,247,0.3)] border-purple-400/20 hover:shadow-[0_4px_35px_rgba(168,85,247,0.45)]",
    green: "from-emerald-500 to-teal-600 shadow-[0_4px_25px_rgba(16,185,129,0.3)] border-emerald-400/20 hover:shadow-[0_4px_35px_rgba(16,185,129,0.45)]",
    orange: "from-orange-500 to-red-500 shadow-[0_4px_25px_rgba(249,115,22,0.3)] border-orange-400/20 hover:shadow-[0_4px_35px_rgba(249,115,22,0.45)]",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`group w-full flex items-center justify-center gap-2.5 bg-gradient-to-r ${colors[color]} border border-t-white/10 disabled:opacity-50 text-white font-bold tracking-wide rounded-2xl py-4.5 text-base transition-all duration-300 active:scale-[0.97] hover:brightness-110`}
    >
      {loading ? <Loader2 size={22} className="animate-spin" /> : icon}
      {loading ? "Processing..." : children}
    </button>
  );
}
