import React from "react";
import Footer from "../components/Footer";
import { Input, Button } from "../components/UI";
import { SendHorizontal, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResendVerificationEmail = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-800 font-sans flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="text-center w-full max-w-3xl animate-slide-up p-8">
          <h1>Resend Verification Email</h1>
          <p className="text-surface-500 mt-2 text-sm">
            Didn't receive the verification email? Enter your email address and
            we'll resend it.
          </p>

          <form className="mt-6 flex flex-col gap-4">
            <div className="text-sm text-surface-500">
              <Input
                type="email"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2 justify-center w-2/4 lg:w-1/4"
            >
              <SendHorizontal size={15} />
              Resend Email
            </Button>
          </form>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-3 rounded-lg border border-surface-200 dark:border-surface-600
                bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-200
                text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-600
                hover:border-surface-300 transition-all duration-150 shadow-sm w-auto justify-center"
        >
          <ArrowLeft size={15} />
          Go back
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-3 rounded-lg
                bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                text-white text-sm font-semibold
                shadow-md hover:shadow-lg transition-all duration-150
                w-auto justify-center"
        >
          <Home size={15} />
          Back to home
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ResendVerificationEmail;
