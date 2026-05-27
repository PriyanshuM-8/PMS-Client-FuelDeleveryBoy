import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import {
  ArrowLeft, MapPin, User, Phone, Fuel, Navigation,
  CheckCircle, IndianRupee, Banknote, QrCode, Loader2
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
  const [paymentMode, setPaymentMode] = useState(null); // "upi" | "cash"

  const fetchOrder = async () => {
    try {
      const data = await api(`/delivery-boy/order/${id}`);
      setOrder(data.data);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message, background: "#1e293b", color: "#f1f5f9" });
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
        cancelButtonColor: "#475569",
        background: "#1e293b",
        color: "#f1f5f9",
        confirmButtonText: "Yes, Confirm",
      });
      if (!result.isConfirmed) return;
    }
    setActionLoading(true);
    try {
      await api(endpoint, { method: "PATCH" });
      await fetchOrder();
      Swal.fire({ icon: "success", title: successMsg, timer: 1500, showConfirmButton: false, background: "#1e293b", color: "#f1f5f9" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.message, background: "#1e293b", color: "#f1f5f9" });
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 size={32} className="text-orange-400 animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  const status = order.status;
  const coords = order.address?.location?.coordinates;

  return (
    <div className="min-h-screen bg-slate-900 pb-8">
      {/* Header */}
      <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-4 sticky top-0 z-10 backdrop-blur flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-slate-400 hover:text-white transition">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="text-white font-semibold text-sm">Order Details</h1>
          <p className="text-slate-400 text-xs">#{id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Progress Bar */}
        <ProgressBar status={status} />

        {/* Customer Info */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <h2 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Customer</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {order.customer?.name?.[0]?.toUpperCase() || "C"}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{order.customer?.name}</p>
              <p className="text-slate-400 text-xs">{order.customer?.phone}</p>
            </div>
            <a
              href={`tel:${order.customer?.phone}`}
              className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400"
            >
              <Phone size={16} />
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <h2 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Delivery Location</h2>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-white text-sm leading-relaxed">{order.address?.full}</p>
          </div>
          {coords && (
            <button
              onClick={handleNavigate}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl py-2.5 text-sm font-medium hover:bg-blue-500/30 transition active:scale-95"
            >
              <Navigation size={16} />
              Open in Google Maps
            </button>
          )}
        </div>

        {/* Fuel Details */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <h2 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Fuel Details</h2>
          <div className="grid grid-cols-3 gap-3">
            <InfoTile icon={<Fuel size={16} className="text-orange-400" />} label="Type" value={order.fuelDetails?.fuelType?.toUpperCase()} />
            <InfoTile icon={<span className="text-orange-400 text-sm font-bold">L</span>} label="Quantity" value={`${order.fuelDetails?.quantity}L`} />
            <InfoTile icon={<IndianRupee size={16} className="text-green-400" />} label="Amount" value={`₹${order.amount}`} />
          </div>
        </div>

        {/* Action Buttons */}
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

function InfoTile({ icon, label, value }) {
  return (
    <div className="bg-slate-700/40 rounded-xl p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-slate-400 text-xs">{label}</p>
      <p className="text-white font-semibold text-sm mt-0.5">{value}</p>
    </div>
  );
}

function ProgressBar({ status }) {
  const steps = [
    { key: "assigned", label: "Assigned" },
    { key: "in_progress", label: "On Way" },
    { key: "reached", label: "Arrived" },
    { key: "payment_pending", label: "Payment" },
    { key: "completed", label: "Done" },
  ];
  const current = stepIndex(status);

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i <= current
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-slate-700 text-slate-500"
              }`}>
                {i < current ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-xs mt-1 ${i <= current ? "text-orange-400" : "text-slate-600"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 rounded ${i < current ? "bg-orange-500" : "bg-slate-700"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionSection({ status, actionLoading, paymentMode, setPaymentMode, order, onMarkInProgress, onArrived, onCashPayment, onFuelDelivered }) {
  if (status === "completed") {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
        <CheckCircle size={40} className="text-green-400 mx-auto mb-2" />
        <p className="text-green-400 font-semibold text-lg">Delivery Completed!</p>
        <p className="text-slate-400 text-sm mt-1">Great job! Order successfully delivered.</p>
      </div>
    );
  }

  if (status === "assigned") {
    return (
      <ActionBtn loading={actionLoading} onClick={onMarkInProgress} color="blue" icon={<Navigation size={18} />}>
        Start Delivery
      </ActionBtn>
    );
  }

  if (status === "in_progress") {
    return (
      <ActionBtn loading={actionLoading} onClick={onArrived} color="purple" icon={<MapPin size={18} />}>
        I've Arrived
      </ActionBtn>
    );
  }

  if (status === "reached") {
    // Payment selection
    if (!paymentMode) {
      return (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <p className="text-white font-semibold text-center mb-1">Select Payment Method</p>
          <p className="text-slate-400 text-xs text-center mb-4">Amount: <span className="text-green-400 font-bold">₹{order.amount}</span></p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMode("upi")}
              className="flex flex-col items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-xl py-4 hover:bg-purple-500/30 transition active:scale-95"
            >
              <QrCode size={24} />
              <span className="text-sm font-medium">UPI Payment</span>
            </button>
            <button
              onClick={() => setPaymentMode("cash")}
              className="flex flex-col items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl py-4 hover:bg-green-500/30 transition active:scale-95"
            >
              <Banknote size={24} />
              <span className="text-sm font-medium">Cash Payment</span>
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
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 space-y-3">
          <div className="text-center">
            <Banknote size={32} className="text-green-400 mx-auto mb-2" />
            <p className="text-white font-semibold">Cash Payment</p>
            <p className="text-3xl font-bold text-green-400 mt-1">₹{order.amount}</p>
            <p className="text-slate-400 text-xs mt-1">Collect cash from customer</p>
          </div>
          <ActionBtn loading={actionLoading} onClick={onCashPayment} color="green" icon={<CheckCircle size={18} />}>
            Cash Received
          </ActionBtn>
          <button onClick={() => setPaymentMode(null)} className="w-full text-slate-400 text-sm py-2 hover:text-white transition">
            ← Back
          </button>
        </div>
      );
    }
  }

  if (status === "payment_pending") {
    return (
      <div className="space-y-3">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
          <p className="text-amber-400 font-medium text-sm">Payment confirmed by customer</p>
          <p className="text-slate-400 text-xs mt-1">Now deliver the fuel and mark as delivered</p>
        </div>
        <ActionBtn loading={actionLoading} onClick={onFuelDelivered} color="orange" icon={<Fuel size={18} />}>
          Fuel Delivered ✓
        </ActionBtn>
      </div>
    );
  }

  return null;
}

function UPIPaymentPanel({ order, onBack }) {
  const upiId = order.pump?.upiId || "petrocareX@upi";
  const amount = order.amount;
  const upiLink = `upi://pay?pa=${upiId}&pn=PM+PetroCareX&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
      <div className="text-center mb-4">
        <QrCode size={24} className="text-purple-400 mx-auto mb-2" />
        <p className="text-white font-semibold">UPI Payment</p>
        <p className="text-3xl font-bold text-green-400 mt-1">₹{amount}</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <div className="bg-white p-3 rounded-2xl shadow-lg">
          <img src={qrUrl} alt="UPI QR" width={160} height={160} className="rounded-lg" />
        </div>
      </div>

      {/* UPI ID — read only */}
      <div className="bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 mb-3">
        <p className="text-slate-400 text-xs mb-0.5">UPI ID (Pump Admin)</p>
        <p className="text-white font-mono text-sm font-semibold select-all">{upiId}</p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 mb-3">
        <p className="text-amber-400 text-xs text-center">
          ⚠️ Show QR to customer. Do NOT share your personal UPI.
        </p>
      </div>

      <button onClick={onBack} className="w-full text-slate-400 text-sm py-2 hover:text-white transition">
        ← Back to payment options
      </button>
    </div>
  );
}

function ActionBtn({ children, onClick, loading, color, icon }) {
  const colors = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/20",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/20",
    green: "from-green-500 to-green-600 shadow-green-500/20",
    orange: "from-orange-500 to-amber-500 shadow-orange-500/20",
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${colors[color]} disabled:opacity-50 text-white font-semibold rounded-2xl py-4 text-base transition-all shadow-lg active:scale-95`}
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : icon}
      {loading ? "Processing..." : children}
    </button>
  );
}
