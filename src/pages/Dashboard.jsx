import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  Clock,
  LogOut,
  Fuel,
  ChevronRight,
  MapPin,
  TrendingUp,
  Bell,
} from 'lucide-react';

const statusColor = {
  assigned: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
  in_progress: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  reached: 'text-violet-400 bg-violet-500/10 border-violet-500/25',
  payment_pending: 'text-orange-400 bg-orange-500/10 border-orange-500/25',
  completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
};
const statusLabel = {
  assigned: 'Assigned',
  in_progress: 'On the Way',
  reached: 'Arrived',
  payment_pending: 'Payment Pending',
  completed: 'Completed',
};

const accentBarColor = {
  assigned: 'bg-sky-400',
  in_progress: 'bg-amber-400',
  reached: 'bg-violet-400',
  payment_pending: 'bg-orange-400',
  completed: 'bg-emerald-400',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/* ── Skeleton card for loading state ─────────────────────────────────── */
function SkeletonCard({ index }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.025] p-5"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* left accent bar placeholder */}
      <div className="absolute left-0 top-0 h-full w-[3px] rounded-l-3xl bg-white/[0.06]" />

      <div className="ml-2 animate-pulse space-y-3">
        {/* status badge */}
        <div className="h-5 w-24 rounded-full bg-white/[0.06]" />
        {/* name */}
        <div className="h-5 w-40 rounded-lg bg-white/[0.06]" />
        {/* address */}
        <div className="h-4 w-56 rounded-lg bg-white/[0.04]" />
        {/* bottom chips */}
        <div className="flex items-center gap-3 border-t border-white/[0.04] pt-3">
          <div className="h-7 w-28 rounded-lg bg-white/[0.06]" />
          <div className="h-7 w-16 rounded-lg bg-white/[0.06]" />
        </div>
      </div>

      {/* shimmer sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}

/* ── Stat card with shimmer ──────────────────────────────────────────── */
function StatCard({ icon: Icon, value, label, accentFrom, accentTo, glowColor }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-2xl transition-all duration-300 hover:bg-white/[0.045] hover:border-white/[0.12]">
      {/* background glow */}
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl transition-all duration-500 group-hover:opacity-70"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      />

      {/* shimmer sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${accentFrom}18, ${accentTo}10)`,
              border: `1px solid ${accentFrom}25`,
            }}
          >
            <Icon size={18} style={{ color: accentFrom }} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            {label}
          </span>
        </div>
        <p className="text-3xl font-black tracking-tight text-white">{value}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════ DASHBOARD ═══════════════════════════════════ */
export default function Dashboard() {
  const { deliveryBoy, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  const fetchOrders = async () => {
    try {
      const data = await api('/delivery-boy/my-orders');
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

  const activeOrders = orders.filter(
    (o) => !['completed', 'cancelled'].includes(o.status),
  );
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const displayed = tab === 'active' ? activeOrders : completedOrders;

  const firstName = deliveryBoy?.name?.split(' ')[0] || 'Partner';
  const avatarLetter = (deliveryBoy?.name?.[0] || 'D').toUpperCase();

  const tabs = [
    { key: 'active', label: 'Active Orders' },
    { key: 'completed', label: 'History' },
  ];

  return (
    <div className="relative min-h-screen bg-[#06060a] pb-8 text-slate-200">
      {/* ── global keyframes injected via style tag ────────────────────── */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeInUp {
          0%   { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(5px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: .5; transform: scale(.75); }
        }
        .animate-fade-in-up {
          animation: fadeInUp .55s cubic-bezier(.22,1,.36,1) both;
        }
      `}</style>

      {/* ── radial glow from top center ───────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(251,146,60,0.07) 0%, rgba(245,158,11,0.03) 40%, transparent 70%)',
        }}
      />

      {/* ═══════════════════ HEADER ═══════════════════════════════════ */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06060a]/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-10">
          {/* left: avatar + name */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-base font-black text-white shadow-lg shadow-orange-500/25 ring-2 ring-white/10">
              {avatarLetter}
            </div>
            <div>
              <p className="text-[15px] font-bold leading-tight tracking-wide text-white">
                {deliveryBoy?.name}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-orange-400/80">
                Delivery Partner
              </p>
            </div>
          </div>

          {/* right: bell + logout */}
          <div className="flex items-center gap-2">
            {/* notification bell */}
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-orange-500/20 hover:bg-orange-500/10 hover:text-orange-400"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {/* indicator dot */}
              <span
                className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-[#06060a]"
                style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
              />
            </button>

            {/* logout */}
            <button
              onClick={logout}
              className="flex h-10 items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={16} />
              <span className="hidden min-[360px]:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════ GREETING ═════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-lg px-4 pt-6">
        <h1 className="text-2xl font-black tracking-tight text-white">
          {getGreeting()},{' '}
          <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            {firstName}!
          </span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Let's deliver excellence today!
        </p>
      </section>

      {/* ═══════════════════ STATS ROW ════════════════════════════════ */}
      <section className="relative z-10 mx-auto mt-5 grid max-w-lg grid-cols-1 gap-3 px-4">
        <StatCard
          icon={Package}
          value={activeOrders.length}
          label="Active"
          accentFrom="#f97316"
          accentTo="#fb923c"
          glowColor="#f97316"
        />
        <StatCard
          icon={CheckCircle}
          value={completedOrders.length}
          label="Completed"
          accentFrom="#10b981"
          accentTo="#34d399"
          glowColor="#10b981"
        />
        <StatCard
          icon={TrendingUp}
          value="₹---"
          label="Earnings"
          accentFrom="#a855f7"
          accentTo="#c084fc"
          glowColor="#a855f7"
        />
      </section>

      {/* ═══════════════════ TABS ═════════════════════════════════════ */}
      <section className="relative z-10 mx-auto mt-8 max-w-lg px-4">
        <div className="relative flex rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1">
          {/* sliding indicator */}
          <div
            className="absolute left-1 top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25 transition-all duration-300 ease-out"
            style={{
              transform:
                tab === 'completed' ? 'translateX(calc(100% + 4px))' : 'translateX(0)',
            }}
          />

          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative z-10 flex-1 py-3 text-center text-sm font-bold tracking-wide transition-colors duration-300 ${
                tab === t.key ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════ ORDER CARDS ══════════════════════════════ */}
      <section className="relative z-10 mx-auto mt-6 max-w-lg space-y-4 px-4">
        {loading ? (
          /* ── Skeleton loaders ────────────────────────────────────── */
          <>
            <SkeletonCard index={0} />
            <SkeletonCard index={1} />
            <SkeletonCard index={2} />
          </>
        ) : displayed.length === 0 ? (
          /* ── Empty state ─────────────────────────────────────────── */
          <div className="flex flex-col items-center rounded-3xl border border-white/[0.05] bg-white/[0.02] py-16">
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
              {/* outer ring glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/10 to-amber-500/10 blur-lg" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03]">
                {tab === 'active' ? (
                  <Clock size={32} className="text-slate-500" />
                ) : (
                  <Package size={32} className="text-slate-500" />
                )}
              </div>
            </div>
            <p className="text-base font-semibold text-slate-400">
              {tab === 'active'
                ? 'No active orders right now'
                : 'No completed orders yet'}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {tab === 'active'
                ? 'New orders will appear here automatically'
                : 'Completed deliveries will show up here'}
            </p>
          </div>
        ) : (
          /* ── Order list ──────────────────────────────────────────── */
          displayed.map((order, idx) => (
            <button
              key={order._id}
              onClick={() => navigate(`/order/${order._id}`)}
              className="animate-fade-in-up group relative w-full overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 pl-7 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/20 hover:bg-white/[0.045] hover:shadow-[0_8px_30px_-12px_rgba(249,115,22,0.15)] active:scale-[0.98]"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* left accent bar */}
              <div
                className={`absolute left-0 top-0 h-full w-[3px] rounded-l-3xl ${
                  accentBarColor[order.status] || 'bg-slate-600'
                }`}
              />

              {/* hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.02] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* status badge */}
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      statusColor[order.status] ||
                      'border-slate-600 bg-slate-700/50 text-slate-300'
                    }`}
                    style={
                      statusColor[order.status]
                        ? {
                            boxShadow: `0 0 12px ${
                              order.status === 'assigned'
                                ? 'rgba(56,189,248,0.12)'
                                : order.status === 'in_progress'
                                ? 'rgba(245,158,11,0.12)'
                                : order.status === 'reached'
                                ? 'rgba(139,92,246,0.12)'
                                : order.status === 'payment_pending'
                                ? 'rgba(249,115,22,0.12)'
                                : 'rgba(16,185,129,0.12)'
                            }`,
                          }
                        : undefined
                    }
                  >
                    {statusLabel[order.status] || order.status}
                  </span>

                  {/* customer name */}
                  <h3 className="mt-2.5 truncate text-lg font-bold tracking-tight text-white">
                    {order.customer?.name || 'Customer'}
                  </h3>

                  {/* address */}
                  <div className="mt-1 flex items-center gap-1.5 text-slate-500">
                    <MapPin size={13} className="shrink-0" />
                    <p className="truncate text-sm">{order.address?.full}</p>
                  </div>

                  {/* bottom chips */}
                  <div className="mt-4 flex items-center gap-3 border-t border-white/[0.05] pt-3">
                    <div className="flex items-center gap-1.5 rounded-lg border border-orange-500/15 bg-orange-500/10 px-2.5 py-1">
                      <Fuel size={13} className="text-orange-400" />
                      <span className="text-xs font-bold capitalize text-orange-400">
                        {order.fuelDetails?.fuelType} • {order.fuelDetails?.quantity}L
                      </span>
                    </div>
                    <span className="rounded-lg border border-emerald-500/15 bg-emerald-500/10 px-2.5 py-1 text-sm font-black tracking-wide text-emerald-400">
                      ₹{order.amount}
                    </span>
                  </div>
                </div>

                {/* chevron */}
                <div className="mt-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] transition-all duration-300 group-hover:border-orange-500/25 group-hover:bg-orange-500 group-hover:shadow-[0_0_16px_rgba(249,115,22,0.35)]">
                  <ChevronRight
                    size={18}
                    className="text-slate-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
                    style={{
                      animation: 'none',
                    }}
                  />
                </div>
              </div>
            </button>
          ))
        )}
      </section>
    </div>
  );
}
