import { Button, Card } from "../components/UI";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleX, Lock, BadgeCheck, SendHorizontal } from "lucide-react";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { useAuth } from "../context/UseAuth";
import { useParams } from "react-router-dom";

const CardUI = ({ type }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center max-w-lg animate-slide-up">
      <div className="relative mb-8 select-none">
        {/* Floating icon in the middle of 404 */}
        <div className="flex items-center justify-center">
          <div
            className={`w-20 h-20 ${type === "success" ? "bg-success" : "bg-error"} rounded-2xl flex items-center justify-center shadow-glow rotate-3`}
          >
            {type === "success" ? (
              <BadgeCheck size={36} className="text-white -rotate-3" />
            ) : (
              <CircleX size={36} className="text-white -rotate-3" />
            )}
          </div>
        </div>
      </div>

      {/* Copy */}
      <h1 className="font-display text-2xl text-surface-800 dark:text-surface-50 font-semibold mb-3">
        {type === "success"
          ? "Your Email Verified Successfully!"
          : "Email Verification Failed!"}
      </h1>
      <p className="text-surface-500 dark:text-surface-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
        {type === "success"
          ? "Your account has been activated successfully. You can now sign in and start using the application."
          : "There was an error verifying your email. Please try again or contact support."}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {type === "success" ? (
          <button
            onClick={() => navigate("/auth", { state: { screen: "login" } })}
            className="flex items-center gap-2 px-5 py-3 rounded-lg
                bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                text-surface-600 text-sm font-semibold
                shadow-md hover:shadow-lg transition-all duration-150
                w-full sm:w-auto justify-center"
          >
            <Lock size={15} />
            Go to login
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              className="flex items-center gap-2"
              size="sm"
              onClick={() => navigate("/auth/send-verification-email")}
            >
              <SendHorizontal size={15} />
              Resend Verification Email
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate("/auth", { state: { screen: "login" } })}
            >
              <Lock size={15} />
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const VerifyEmail = () => {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(null);
  const [errors, setError] = React.useState("");
  const params=useParams();

  const { verifyEmail } = useAuth();

  const handleVerification = async () => {
    setLoading(true);
    try {
      // Simulate API call to verify email
      const result = await verifyEmail(params.token);
      if (result.error) {
        throw new Error(result.error);
      }
      // Simulate success response
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setError({
        general: err.message || "Verification failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleVerification();
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-800 font-sans flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        {loading ? (
          <div className="text-center max-w-lg animate-slide-up">
            <PageLoader message={["Verifying your email"]} />
          </div>
        ) : success ? (
          <CardUI type="success" />
        ) : (
          <CardUI type="error" />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default VerifyEmail;
