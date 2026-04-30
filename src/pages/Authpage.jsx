import { useEffect, useState } from "react";
import { Button, Input, Card, ResponseCard } from "../components/UI";
import NavBar from "../components/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { getPasswordStrength, isValidEmail, reg, validate } from "../utils/validate";
import { useAuth } from "../context/UseAuth";


const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// ── SCREEN: Choose path ───────────────────────────────────
function ChoosePath({ onLogin, onSignup, onGuest, onBack }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="text-center mb-2">
        <h2 className="font-display text-2xl text-surface-900 mb-1">
          How would you like to continue?
        </h2>
        <p className="text-sm text-surface-500">
          Pick an option to get started
        </p>
      </div>

      {/* Login */}
      <button
        onClick={onLogin}
        className="w-full flex items-center gap-4 p-4 bg-primary-500 hover:bg-primary-600 rounded-2xl transition-all hover:-translate-y-0.5 active:scale-[0.98] group"
      >
        <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A0A0A"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </div>
        <div className="text-left flex-1">
          <div className="font-semibold text-surface-900 text-sm">Sign In</div>
          <div className="text-xs text-surface-800/70">
            Email or social account
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0A0A0A"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="opacity-60"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Sign up */}
      <button
        onClick={onSignup}
        className="w-full flex items-center gap-4 p-4 bg-surface-800 border border-white/10 hover:border-primary-500/40 hover:bg-surface-700 rounded-2xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F5C542"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </div>
        <div className="text-left flex-1">
          <div className="font-semibold text-white text-sm">Create Account</div>
          <div className="text-xs text-surface-400">Name, email & password</div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#888"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="flex items-center gap-3 my-1">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-xs text-surface-500">or</span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      {/* Guest */}
      <button
        onClick={onGuest}
        className="w-full flex items-center gap-4 p-4 bg-surface-200 border border-dashed border-white/15 hover:border-white/30 hover:bg-surface-300 rounded-2xl transition-all group"
      >
        <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center flex-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#888"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="text-left flex-1">
          <div className="font-medium text-surface-600 text-sm group-hover:text-surface-700 transition-colors">
            Continue as Guest
          </div>
          <div className="text-xs text-surface-500">
            Name & phone only — no account needed
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

// ── SCREEN: Login form ────────────────────────────────────
export function LoginForm({
  onBack,
  onForgot,
  onSignUp,
  showPassword,
  onShowPassword,
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value, setErrors);
  };

  const location = useLocation();

  const handleLogin = async () => {
    setErrors({});
    if (
      !validate("email", form.email, setErrors) ||
      !validate("password", form.password, setErrors)
    )
      return;
    setLoading(true);
    const loginResponse = await login(form.email, form.password);

    if (loginResponse?.error) {
      setErrors({
        general: loginResponse.error?.data?.message || "Login failed",
      });
      setLoading(false);
      return;
    }

    if (loginResponse?.user?.role === "customer") navigate("/dashboard/");
    else if (loginResponse?.user?.role === "washer")
      navigate("/washer/dashboard");
    else if (loginResponse?.user?.role === "admin") navigate("/admin/overview");
  };

  return (
    <div className="w-full">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-900 mb-6 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
      )}
      <h2 className="font-display text-2xl text-surface-900 mb-1">
        Welcome back
      </h2>
      <p className="text-sm text-surface-500 mb-6">Sign in to your account</p>

      {/* General error */}
      {errors.general && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-error bg-opacity-10 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-error dark:text-red-400 text-sm">
            {errors.general}
          </p>
        </div>
      )}

      <button className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 rounded-xl py-3 text-sm font-medium text-surface-900 transition-all mb-5">
        <GoogleIcon /> Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-xs text-surface-500">or</span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <div className="flex flex-col gap-4 mb-2">
        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />
        <Input
          label="Password"
          type={!showPassword ? "password" : "text"}
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
          eye={
            showPassword ? (
              <Eye size={15} onClick={onShowPassword} />
            ) : (
              <EyeOff size={15} onClick={onShowPassword} />
            )
          }
        />
      </div>

      <div className="text-right mb-5">
        <button
          onClick={onForgot}
          className="text-xs text-info hover:text-surface-900 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <Button
        className="w-full mb-3"
        size="lg"
        disabled={
          !!errors.email ||
          !!errors.password ||
          !form.email ||
          !form.password ||
          loading
        }
        onClick={handleLogin}
      >
        {loading ? "Signing in..." : "Sign In →"}
      </Button>
      {location.pathname === "/auth" && (
        <p className="text-xs text-surface-500 text-center">
          Don't have an account yet?{" "}
          <button
            onClick={onSignUp}
            className="text-info hover:text-surface-900 transition-colors"
          >
            Create a free account
          </button>
        </p>
      )}
    </div>
  );
}

// ── SCREEN: Sign up form ──────────────────────────────────
function SignupForm({
  onBack,
  onSignIn,
  showPassword,
  onShowPassword,
  showPassword2,
  onShowPassword2,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value, setErrors);
  };

  const passwordStrength = getPasswordStrength(form.password);
  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;


  const { signUp } = useAuth();

  const handleSignUp = async () => {
    setErrors({});
    if (
      !validate("email", form.email, setErrors) ||
      !validate("name", form.name, setErrors) ||
      !validate("phone", form.phone, setErrors) ||
      !validate("password", form.password, setErrors) ||
      !validate("password2", form.password2, setErrors)
    )
      return;

    if (!isValidEmail(form.email)) {
      setErrors({ email: "Email is invalid" });
      return;
    }

    if (!reg.test(form.phone)) {
      setErrors({ phone: "Invalid phone number" });
      return;
    }
    if (strengthScore < 4) {
      setErrors({ password: "Your password is weak" });
      return;
    }

    if (form.password !== form.password2) {
      setErrors({
        password: "Password don't match",
        password2: "Password don't match",
      });
      return;
    }

    setLoading(true);
    const res = await signUp(
      form.name,
      form.email,
      form.phone,
      form.password,
    );

    if (res?.error) {

      setErrors({
        general: res.error?.message || "Creating account failed",
      });
      setLoading(false);
      return;
    }

    navigate("/auth");
  };

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-500 mb-6 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </button>
      <h2 className="font-display text-2xl text-surface-900 mb-1">
        Create your account
      </h2>
      <p className="text-sm text-surface-400 mb-6">
        Join thousands of happy customers
      </p>

      {errors.general && <ResponseCard type="error" message={errors.general} />}

      <button className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 rounded-xl py-3 text-sm font-medium text-surface-900 transition-all mb-5">
        <GoogleIcon /> Sign up with Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-xs text-surface-500">or</span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <div className="flex flex-col gap-4 mb-5">
        <Input
          label="Full name"
          placeholder="Full names"
          value={form.name}
          name="name"
          onChange={handleChange}
          error={errors.name}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          }
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          name="email"
          error={errors.email}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />
        <Input
          label="Phone number"
          type="number"
          placeholder="0788000000"
          value={form.phone}
          name="phone"
          onChange={handleChange}
          error={errors.phone}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.73-.73a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={handleChange}
          name="password"
          error={errors.password}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
          eye={
            showPassword ? (
              <Eye size={15} onClick={onShowPassword} />
            ) : (
              <EyeOff size={15} onClick={onShowPassword} />
            )
          }
        />
        {strengthScore < 5 && (
          <p className="text-xs text-surface-400">
            Use at least 8 chars, one lowercase, one uppercase, one number and
            one symbol
          </p>
        )}

        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-0.5 flex-1 rounded transition-all ${
                strengthScore >= level
                  ? strengthScore <= 2
                    ? "bg-red-500"
                    : strengthScore === 3
                      ? "bg-yellow-500"
                      : strengthScore === 4
                        ? "bg-blue-500"
                        : "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Input
          label="Re-enter password"
          type={showPassword2 ? "text" : "password"}
          placeholder="Min. 8 characters"
          value={form.password2}
          onChange={handleChange}
          name="password2"
          error={errors.password2}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
          eye={
            showPassword2 ? (
              <Eye size={15} onClick={onShowPassword2} />
            ) : (
              <EyeOff size={15} onClick={onShowPassword2} />
            )
          }
        />
      </div>

      <p className="text-xs text-surface-500 text-center mb-3">
        By signing up you agree to our{" "}
        <a href="#" className="text-info hover:underline">
          Terms
        </a>{" "}
        &{" "}
        <a href="#" className="text-info hover:underline">
          Privacy Policy
        </a>
      </p>

      <Button
        className={`w-full mb-3`}
        size="lg"
        disabled={
          !!errors.email ||
          !!errors.name ||
          !!errors.phone ||
          !!errors.password ||
          !!errors.password2 ||
          !form.name ||
          !form.email ||
          !form.phone ||
          !form.password ||
          !form.password2
        }
        onClick={handleSignUp}
      >
        {loading ? "Signing up..." : "Create Account →"}
      </Button>

      <p className="text-xs text-surface-500 text-center">
        Already have account?{" "}
        <button
          onClick={onSignIn}
          className="text-info hover:text-surface-900 transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

// ── SCREEN: Guest form ────────────────────────────────────
function GuestForm({ onSubmit, onBack }) {
  const [form, setForm] = useState({ email: "", name: "", phone: "" });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { guestLogin } = useAuth();
  const reg = new RegExp("^((072|078|073))[0-9]{7}$", "i");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value, setErrors);
  };

  const handleLogin = async () => {
    setErrors({});
    if (
      !validate("email", form.email, setErrors) ||
      !validate("name", form.name, setErrors) ||
      !validate("phone", form.phone, setErrors)
    )
      return;

    if (!isValidEmail(form.email)) {
      setErrors({ email: "Email is invalid" });
      return;
    }
    if (!reg.test(form.phone)) {
      setErrors({ phone: "Invalid phone number" });
      return;
    }
    setLoading(true);
    const loginResponse = await guestLogin(form.name, form.phone, form.email);

    if (loginResponse?.error) {
      console.log(loginResponse?.error);

      setErrors({
        general: loginResponse.error?.message || "Guest booking failed",
      });
      setLoading(false);
      return;
    }

    navigate("/booking");
  };

  return (
    <div className="w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-500 mb-6 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </button>

      <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-6 flex gap-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F5C542"
          strokeWidth="2"
          strokeLinecap="round"
          className="flex-shrink-0 mt-0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs text-surface-500 leading-relaxed">
          No account needed — just your name,email and phone. After your wash,
          we'll ask if you'd like to save your details for next time.
        </p>
      </div>

      <h2 className="font-display text-2xl text-surface-900 mb-1">
        Continue as guest
      </h2>
      <p className="text-sm text-surface-500 mb-6">
        We just need the basics to book your wash
      </p>

      {errors.general && <ResponseCard type="error" message={errors.general} />}

      <div className="flex flex-col gap-4 mb-6">
        <Input
          label="Your name"
          placeholder="Amira Kagabo"
          value={form.name}
          name="name"
          onChange={handleChange}
          error={errors.name}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          }
        />
        <Input
          label="Your Email"
          placeholder="eg:you@example.com"
          value={form.email}
          name="email"
          onChange={handleChange}
          error={errors.email}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />
        <Input
          label="Phone number"
          type="tel"
          placeholder="+250 788 000 000"
          value={form.phone}
          name="phone"
          onChange={handleChange}
          error={errors.phone}
          icon={
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.73-.73a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />
      </div>

      <Button
        className="w-full mb-4"
        size="lg"
        disabled={
          !!errors.email ||
          !!errors.phone ||
          !!errors.name ||
          !form.email ||
          !form.phone ||
          !form.name ||
          loading
        }
        onClick={handleLogin}
      >
        {loading ? "Processing" : "Continue to Booking →"}
      </Button>

      <p className="text-xs text-surface-500 text-center">
        Want the full experience?{" "}
        <button
          onClick={onBack}
          className="text-info hover:text-surface-900 transition-colors"
        >
          Create a free account
        </button>
      </p>
    </div>
  );
}

// ── MAIN AUTH PAGE ────────────────────────────────────────
export default function AuthPage({ navigate }) {
  const location = useLocation();
  const [screen, setScreen] = useState(
    location.state?.screen ? location.state.screen : "choose",
  ); // choose | login | signup | guest
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user && token) {
      if (user.role === "customer") {
        if (!user.isGuest) {
          navigate("/dashboard/");
        } else navigate("/auth");
      } else navigate("/admin/overview");
    }
  }, []);
  

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <NavBar />
      {/* Background */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245,197,66,0.32) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245,197,66,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,10,10,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.05) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <div className="relative z-10 w-full max-w-lg pt-20">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="font-display text-3xl text-surface-900 hover:opacity-80 transition-opacity"
          >
            Mobile Ikinamba<span className="text-primary-500">.</span>
          </button>
          <p className="text-surface-500 text-sm mt-1.5">
            Mobile car wash, delivered to you
          </p>
        </div>

        <Card glow className="p-6">
          {screen === "choose" && (
            <ChoosePath
              onLogin={() => setScreen("login")}
              onSignup={() => setScreen("signup")}
              onGuest={() => setScreen("guest")}
              onBack={() => setScreen("choose")}
            />
          )}
          {screen === "login" && (
            <LoginForm
              onBack={() => setScreen("choose")}
              onForgot={() => {}}
              onSignUp={() => setScreen("signup")}
              showPassword={showPassword}
              onShowPassword={() => setShowPassword(!showPassword)}
            />
          )}
          {screen === "signup" && (
            <SignupForm
              onBack={() => setScreen("choose")}
              onSignIn={() => setScreen("login")}
              showPassword={showPassword}
              onShowPassword={() => setShowPassword(!showPassword)}
              showPassword2={showPassword2}
              onShowPassword2={() => setShowPassword2(!showPassword2)}
            />
          )}
          {screen === "guest" && (
            <GuestForm onBack={() => setScreen("choose")} />
          )}
        </Card>
      </div>
    </div>
  );
}
