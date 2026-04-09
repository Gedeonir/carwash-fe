import { useState } from "react";
import { Button, Card, Input } from "../../components/UI";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../Authpage";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      if (email === "admin@ikinamba.com" && password === "123456") {
        localStorage.setItem("admin_token", "demo-token");
        navigate("/admin/overview");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-100 px-4 relative overflow-hidden py-12">

      {/* Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,197,66,0.28) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,197,66,0.16) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(10,10,10,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.05) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />

      {/* Card — truly centered */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Logo + label above card */}
        <div className="text-center mb-6">
          <p className="font-display text-3xl text-surface-900">
            Ikinamba<span className="text-primary-500">.</span>
          </p>
          <div className="inline-flex items-center gap-2 mt-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span className="text-xs font-medium text-primary-600 tracking-wide uppercase">Admin Portal</span>
          </div>
        </div>

        <Card glow className="p-6">
          <LoginForm
            onSubmit={handleLogin}
            onBack={false}
            onForgot={() => {}}
          />
        </Card>

        <p className="text-center text-xs text-surface-400 mt-5">
          Admin access only · Unauthorized use is prohibited
        </p>
      </div>
    </div>
  );
}