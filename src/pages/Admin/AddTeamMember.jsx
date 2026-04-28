import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, ResponseCard } from "../../components/UI";
import api from "../../utils/api";
import { Eye, EyeOff, ChevronLeft, Check, IdCard, X } from "lucide-react";
import { getPasswordStrength, validate } from "../../utils/validate";
import LocationSearch from "../../components/LocationSearch";
import { isValidEmail, reg } from "../../utils/validate";

// ── Kigali zones ──────────────────────────────────────────
const ZONES = [
  "Kimihurura",
  "Kiyovu",
  "Remera",
  "Nyamirambo",
  "Kibagabaga",
  "Gisozi",
  "Kacyiru",
  "Kanombe",
  "CBD",
  "Gacuriro",
  "Biryogo",
  "Kimisagara",
];

// ── Inline input ──────────────────────────────────────────
function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-1.5">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-surface-400 mb-2">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-error mt-1.5 flex items-center gap-1">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export default function AddTeamMember({ navigate }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    id: "",
    password: "",
    confirmPassword: "",
  });

  const [location, setLocation] = useState("");

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(null); // created washer

  const passwordStrength = getPasswordStrength(form.password);
  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value, setErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    if (
      !validate("name", form.name, setErrors) ||
      !validate("email", form.email, setErrors) ||
      !validate("phone", form.phone, setErrors) ||
      !validate("id", form.id, setErrors)
    )
      return;

    if (!isValidEmail(form.email)) {
      setErrors({ email: "Email is invalid" });
      return;
    }
    if (!new RegExp("^((1|2))[0-9]{15}$", "i").test(form.id)) {
      setErrors({ id: "Invalid ID number" });
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

    if (form.password !== form.confirmPassword) {
      setErrors({
        password: "Password don't match",
        confirmPassword: "Password don't match",
      });
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      const res = await api.post("/users", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        id: form.id,
        location: location,
        zone: {
          address: location.address,
          coordinates: {
            lat: location.coordinates.lat,
            lng: location.coordinates.lng,
          },
        },
        password: form.password,
      });

      setSuccess(res.data?.data?.washer);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        "Failed to create washer. Please try again.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────────────
  if (success) {
    const initials = (success.name || "?")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-success bg-opacity-10 flex items-center justify-center mx-auto mb-6">
          <Check size={36} className="text-success" />
        </div>
        <h2 className="font-display text-2xl text-surface-900 mb-2">
          Washer added!
        </h2>
        <p className="text-surface-500 text-sm mb-6">
          <strong>{success.name}</strong> has been created and can now log in to
          the app.
        </p>

        {/* Summary card */}
        <Card className="p-5 mb-6 text-left">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-500/15 flex items-center justify-center font-display text-primary-600 text-lg flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-surface-900">{success.name}</p>
              <p className="text-xs text-surface-400">
                {success.savedLocations[0]?.address} · New washer
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm border-t border-surface-100 pt-4">
            <div className="flex justify-between">
              <span className="text-surface-400">Email</span>
              <span className="text-surface-700">{success.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Phone</span>
              <span className="text-surface-700">{success.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Zone</span>
              <span className="text-surface-700">
                {success.savedLocations[0]?.address}{" "}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Status</span>
              <span className="text-success font-medium">Available</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => {
              setSuccess(null);
              setForm({
                name: "",
                email: "",
                phone: "",
                zone: "",
                password: "",
                confirmPassword: "",
              });
              setErrors({});
            }}
          >
            Add another washer
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/admin/team")}
          >
            Back to Team →
          </Button>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="font-display text-2xl text-surface-900">
            Add New Washer
          </h1>
          <p className="text-sm text-surface-400 mt-0.5">
            Create a washer account and assign their zone
          </p>
        </div>
      </div>

      {/* API error banner */}
      {apiError && (
        <ResponseCard title={"Error"} message={apiError} type="error" />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Card className="p-6 mb-5">
          <h2 className="font-display text-base text-surface-900 mb-5 pb-3 border-b border-surface-100">
            Personal information
          </h2>

          <div className="space-y-4">
            {/* Full name */}
            <Field label="Full name" required error={errors.name}>
              <Input
                type="text"
                placeholder="Jean Nkurunziza"
                value={form.name}
                name="name"
                onChange={handleChange}
                data-error={!!errors.name}
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
            </Field>

            <Field label="Full name" required error={errors.id}>
              <Input
                type="text"
                placeholder="x xxxx xxxxxxxx xx"
                value={form.id}
                name="id"
                onChange={handleChange}
                data-error={!!errors.name}
                icon={<IdCard size={18} />}
              />
            </Field>

            {/* Email */}
            <Field
              label="Email address"
              required
              error={errors.email}
              hint="This will be used to log in"
            >
              <Input
                type="email"
                placeholder="jean@ikinamba.com"
                value={form.email}
                name="email"
                onChange={handleChange}
                data-error={!!errors.email}
                autoComplete="off"
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
            </Field>

            {/* Phone */}
            <Field label="Phone number" required error={errors.phone}>
              <Input
                type="tel"
                placeholder="+250 788 000 000"
                value={form.phone}
                name="phone"
                onChange={handleChange}
                data-error={!!errors.phone}
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
            </Field>
          </div>
        </Card>

        {/* Zone assignment */}
        <Card className="p-6 mb-5">
          <h2 className="font-display text-base text-surface-900 mb-1 pb-3 border-b border-surface-100">
            Zone assignment
          </h2>

          <Field
            label="Primary zone"
            required
            error={errors.location}
            hint="The neighbourhood this washer primarily covers"
          >
            {/* Custom zone input */}
            <div className="mt-3">
              <p className="text-xs text-surface-400 mb-1.5">
                Type a custom zone:
              </p>

              {location ? (
                <Card className="mt-4 text-sm p-2 relative">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-surface-400">
                      {location.label}
                    </span>
                    <strong className="text-surface-500">
                      {location.address}
                    </strong>
                  </div>
                  <X
                    size={15}
                    className="text-primary-500 absolute cursor-pointer right-4 top-2"
                    onClick={() => setLocation(null)}
                  />
                </Card>
              ) : (
                <LocationSearch onSelect={setLocation} />
              )}
            </div>
          </Field>
        </Card>

        {/* Password */}
        <Card className="p-6 mb-6">
          <h2 className="font-display text-base text-surface-900 mb-1 pb-3 border-b border-surface-100">
            Account credentials
          </h2>

          <div className="space-y-4 mt-4">
            {/* Password */}
            <Field
              label="Temporary password"
              required
              error={errors.password}
              hint="The washer must change this after first login"
            >
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  name="password"
                  onChange={handleChange}
                  data-error={!!errors.password}
                  autoComplete="new-password"
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
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-4 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {strengthScore < 5 && (
                <p className="text-xs text-surface-400">
                  Use at least 8 chars, one lowercase, one uppercase, one number
                  and one symbol
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
            </Field>

            {/* Confirm password */}
            <Field
              label="Confirm password"
              required
              error={errors.confirmPassword}
            >
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                  data-error={!!errors.confirmPassword}
                  autoComplete="new-password"
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
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-4 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Match indicator */}
              {form.confirmPassword.length > 0 && form.password.length > 0 && (
                <p
                  className={`text-xs mt-1.5 flex items-center gap-1 ${form.password === form.confirmPassword ? "text-success" : "text-surface-400"}`}
                >
                  {form.password === form.confirmPassword ? (
                    <>
                      <Check size={11} /> Passwords match
                    </>
                  ) : (
                    "Passwords don't match yet"
                  )}
                </p>
              )}
            </Field>
          </div>
        </Card>

        {/* Preview card */}
        {form.name && (
          <div className="mb-6 bg-surface-50 border border-surface-200 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-500/15 flex items-center justify-center font-display text-primary-600 text-lg flex-shrink-0">
              {form.name
                .trim()
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-surface-900 text-sm truncate">
                {form.name}
              </p>
              <p className="text-xs text-surface-400 truncate">
                {form.email || "No email yet"} ·{" "}
                {location?.address || "No zone set"}
              </p>
            </div>
            <span className="text-xs bg-success/10 text-success border border-success/20 rounded-full px-2.5 py-1 font-medium flex-shrink-0">
              Available
            </span>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-full h-12" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Creating washer...
              </span>
            ) : (
              "Create Washer Account →"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/admin/team")}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>

        <p className="text-xs text-surface-400 text-center mt-4">
          The washer will receive login credentials and can immediately start
          accepting bookings.
        </p>
      </form>
    </div>
  );
}
