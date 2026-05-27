import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { Package, CheckCircle, Clock, LogOut, Fuel, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColor = {
  assigned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  reached: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  payment_pending: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
};

const statusLabel = {
  assigned: "Assigned",
  in_progress: "On the Way",
  reached: "Arrived",
  payment_pending: "Payment Pending",
  completed: "Completed",
};

export default function Dashboard() {
  const { deliveryBoy, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");

  const fetchOrders = async () => {
    try {
      const data = await api("/delivery-boy/my-orders");
      setOrders(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const completedOrders = orders.filter((o) => o.status === "completed");
  const displayed = tab === "active" ? activeOrders : completedOrders;

  return (
    <div className="min-h-screen bg-slate-900 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 border-b border-slate-700/50 px-4 py-4 sticky top-0 z-10 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Fuel size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{deliveryBoy?.name}</p>
              <p className="text-slate-400 text-xs">Delivery Partner</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package size={16} className="text-orange-400" />
            <span className="text-slate-400 text-xs">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeOrders.length}</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-slate-400 text-xs">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{completedOrders.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-2">
        {["active", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
              tab === t
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            {t === "active" ? "Active Orders" : "Completed"}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading orders...</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {tab === "active" ? "No active orders" : "No completed orders"}
            </p>
          </div>
        ) : (
          displayed.map((order) => (
            <button
              key={order._id}
              onClick={() => navigate(`/order/${order._id}`)}
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-left hover:border-orange-500/40 transition active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor[order.status] || "bg-slate-700 text-slate-400 border-slate-600"}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-white font-semibold text-sm truncate">
                    {order.customer?.name || "Customer"}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{order.address?.full}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-orange-400 text-xs font-medium capitalize">
                      {order.fuelDetails?.fuelType} • {order.fuelDetails?.quantity}L
                    </span>
                    <span className="text-green-400 text-xs font-semibold">₹{order.amount}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-500 mt-1 shrink-0" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
