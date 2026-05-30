import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OrderDetail from "./pages/OrderDetail";
import NewOrderAlert from "./components/NewOrderAlert";

function ProtectedRoute({ children }) {
  const { deliveryBoy, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
        <p className="text-slate-500 text-sm font-medium tracking-wider uppercase animate-pulse">Loading...</p>
      </div>
    </div>
  );
  return deliveryBoy ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { deliveryBoy } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {deliveryBoy && <NewOrderAlert />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
