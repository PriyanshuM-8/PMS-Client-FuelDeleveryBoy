import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "../../public/Logo.png";

export default function Login() {
  const { login, deliveryBoy } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (deliveryBoy) navigate("/", { replace: true });
  }, [deliveryBoy]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.phone, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Keyframe animations injected via style tag ── */}
      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, -120px) scale(1.15); }
          50% { transform: translate(-60px, -200px) scale(0.9); }
          75% { transform: translate(-120px, -80px) scale(1.05); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-100px, 80px) scale(1.1); }
          50% { transform: translate(120px, 160px) scale(0.85); }
          75% { transform: translate(60px, -60px) scale(1.2); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(140px, 100px) scale(1.1); }
          66% { transform: translate(-80px, -140px) scale(0.95); }
        }
        @keyframes orbFloat4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          20% { transform: translate(-60px, -100px) scale(1.15); }
          40% { transform: translate(100px, -50px) scale(0.9); }
          60% { transform: translate(50px, 120px) scale(1.05); }
          80% { transform: translate(-100px, 60px) scale(1.1); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(251, 146, 60, 0.3); box-shadow: 0 0 20px rgba(251, 146, 60, 0.1); }
          50% { border-color: rgba(251, 146, 60, 0.6); box-shadow: 0 0 40px rgba(251, 146, 60, 0.2), 0 0 80px rgba(251, 146, 60, 0.05); }
        }
        @keyframes cardBorderShimmer {
          0% { border-color: rgba(255, 255, 255, 0.06); }
          25% { border-color: rgba(251, 146, 60, 0.15); }
          50% { border-color: rgba(168, 85, 247, 0.12); }
          75% { border-color: rgba(251, 146, 60, 0.15); }
          100% { border-color: rgba(255, 255, 255, 0.06); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes buttonPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3), 0 4px 15px rgba(249, 115, 22, 0.2); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.45), 0 4px 25px rgba(249, 115, 22, 0.3); }
        }
        @keyframes slideInShake {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { transform: translateY(3px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }
        @keyframes particleDrift1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          25% { transform: translate(30px, -50px); opacity: 0.6; }
          50% { transform: translate(-20px, -100px); opacity: 0.2; }
          75% { transform: translate(50px, -30px); opacity: 0.5; }
        }
        @keyframes particleDrift2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          33% { transform: translate(-40px, 60px); opacity: 0.5; }
          66% { transform: translate(60px, -40px); opacity: 0.3; }
        }
        @keyframes particleDrift3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(70px, 80px); opacity: 0.15; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes inputFocusGlow {
          0%, 100% { box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.3); }
          50% { box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.15), 0 0 20px rgba(251, 146, 60, 0.1); }
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative"
        style={{ backgroundColor: "#0a0a0f" }}
      >
        {/* ── Animated gradient orbs ── */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0) 70%)",
            animation: "orbFloat1 18s ease-in-out infinite",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            right: "10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0) 70%)",
            animation: "orbFloat2 22s ease-in-out infinite",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "25%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0) 70%)",
            animation: "orbFloat3 15s ease-in-out infinite",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "5%",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, rgba(168,85,247,0.08) 50%, transparent 70%)",
            animation: "orbFloat4 25s ease-in-out infinite",
            filter: "blur(45px)",
            pointerEvents: "none",
          }}
        />

        {/* ── Floating particles ── */}
        {[
          { top: "8%", left: "20%", size: 3, anim: "particleDrift1", dur: "12s", delay: "0s" },
          { top: "15%", left: "70%", size: 2, anim: "particleDrift2", dur: "16s", delay: "2s" },
          { top: "30%", left: "10%", size: 2.5, anim: "particleDrift3", dur: "14s", delay: "1s" },
          { top: "60%", left: "80%", size: 2, anim: "particleDrift1", dur: "18s", delay: "4s" },
          { top: "75%", left: "30%", size: 3, anim: "particleDrift2", dur: "20s", delay: "3s" },
          { top: "45%", left: "90%", size: 1.5, anim: "particleDrift3", dur: "13s", delay: "5s" },
          { top: "85%", left: "55%", size: 2, anim: "particleDrift1", dur: "17s", delay: "1.5s" },
          { top: "20%", left: "45%", size: 1.5, anim: "particleDrift2", dur: "19s", delay: "6s" },
          { top: "55%", left: "5%", size: 2, anim: "particleDrift3", dur: "15s", delay: "2.5s" },
          { top: "92%", left: "15%", size: 2.5, anim: "particleDrift1", dur: "21s", delay: "7s" },
          { top: "5%", left: "85%", size: 1.5, anim: "particleDrift2", dur: "11s", delay: "0.5s" },
          { top: "40%", left: "60%", size: 2, anim: "particleDrift3", dur: "16s", delay: "3.5s" },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              backgroundColor: "rgba(251, 146, 60, 0.4)",
              animation: `${p.anim} ${p.dur} ease-in-out infinite`,
              animationDelay: p.delay,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* ── Main content card ── */}
        <div
          className="w-full max-w-sm relative z-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* ── Logo section ── */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div
                className="relative p-4 rounded-2xl backdrop-blur-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(251, 146, 60, 0.3)",
                  animation: "borderGlow 3s ease-in-out infinite",
                }}
              >
                {/* Outer glow ring */}
                <div
                  className="absolute -inset-[1px] rounded-2xl -z-10"
                  style={{
                    background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(168,85,247,0.1), rgba(245,158,11,0.2))",
                    filter: "blur(8px)",
                    opacity: 0.6,
                  }}
                />
                <img
                  src={Logo}
                  alt="PM CareX Logo"
                  className="h-16 w-16 object-contain relative z-10"
                />
              </div>
            </div>

            {/* ── Title ── */}
            <h1
              className="text-4xl font-extrabold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #f97316, #f59e0b, #fbbf24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              PM CareX
            </h1>
            <p
              className="text-xs font-semibold mt-2 uppercase"
              style={{
                letterSpacing: "0.3em",
                color: "rgba(251, 146, 60, 0.6)",
              }}
            >
              Delivery Partner Portal
            </p>
          </div>

          {/* ── Form card ── */}
          <div
            className="relative rounded-3xl p-6 backdrop-blur-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              animation: "cardBorderShimmer 6s ease-in-out infinite",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Card inner glow */}
            <div
              className="absolute inset-0 rounded-3xl -z-10"
              style={{
                background: "radial-gradient(ellipse at top, rgba(249,115,22,0.04), transparent 60%)",
                pointerEvents: "none",
              }}
            />

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ── Phone field ── */}
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone
                      size={16}
                      className="transition-colors duration-300"
                      style={{ color: "rgba(251, 146, 60, 0.5)" }}
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(251, 146, 60, 0.5)";
                      e.target.style.animation = "inputFocusGlow 2s ease-in-out infinite";
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.target.style.animation = "none";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                    }}
                  />
                </div>
              </div>

              {/* ── Password field ── */}
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      size={16}
                      className="transition-colors duration-300"
                      style={{ color: "rgba(251, 146, 60, 0.5)" }}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full rounded-xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-white/20 outline-none transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(251, 146, 60, 0.5)";
                      e.target.style.animation = "inputFocusGlow 2s ease-in-out infinite";
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.target.style.animation = "none";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                    }}
                  />
                  {/* Password visibility toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200"
                    style={{ color: "rgba(255, 255, 255, 0.3)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(251, 146, 60, 0.7)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.3)")}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* ── Error message ── */}
              {error && (
                <div
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "#f87171",
                    animation: "slideInShake 0.4s ease-out",
                    boxShadow: "0 0 20px rgba(239, 68, 68, 0.08)",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "#f87171" }}
                  />
                  {error}
                </div>
              )}

              {/* ── Submit button ── */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full rounded-xl py-3.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                style={{
                  background: loading
                    ? "linear-gradient(135deg, #92400e, #78350f)"
                    : "linear-gradient(135deg, #f97316, #ef4444, #f59e0b, #f97316)",
                  backgroundSize: "300% 300%",
                  animation: loading
                    ? "none"
                    : "gradientShift 4s ease infinite, buttonPulse 2.5s ease-in-out infinite",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 0 35px rgba(249, 115, 22, 0.5), 0 8px 25px rgba(249, 115, 22, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {/* Shine effect layer */}
                {!loading && (
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 55%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <span
                        className="inline-block w-4 h-4 rounded-full"
                        style={{
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white",
                          animation: "spinLoader 0.6s linear infinite",
                        }}
                      />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* ── Footer ── */}
          <p
            className="text-center text-[11px] mt-7 font-medium tracking-wide"
            style={{ color: "rgba(255, 255, 255, 0.2)" }}
          >
            Contact your pump admin for credentials
          </p>
        </div>
      </div>
    </>
  );
}
