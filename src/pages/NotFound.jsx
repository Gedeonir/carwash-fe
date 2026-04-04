import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, Home, Search } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-800 font-sans flex flex-col">

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="text-center max-w-lg animate-slide-up">

          {/* Large 404 display */}
          <div className="relative mb-8 select-none">
            <p className="font-display text-[10rem] leading-none font-semibold text-surface-200 dark:text-surface-700">
              404
            </p>
            {/* Floating icon in the middle of 404 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center shadow-glow rotate-3">
                <Search size={36} className="text-white -rotate-3" />
              </div>
            </div>
          </div>

          {/* Copy */}
          <h1 className="font-display text-3xl text-surface-800 dark:text-surface-50 font-semibold mb-3">
            Page not found
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Looks like this page has been removed, moved, or never existed.
            Let's get you back on track.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-3 rounded-lg border border-surface-200 dark:border-surface-600
                bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-200
                text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-600
                hover:border-surface-300 transition-all duration-150 shadow-sm w-full sm:w-auto justify-center"
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
                w-full sm:w-auto justify-center"
            >
              <Home size={15} />
              Back to home
            </button>
          </div>

          {/* Subtle hint */}
          <p className="mt-10 text-xs text-surface-400 dark:text-surface-500">
            If you believe this is a mistake, please contact your administrator.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default NotFound;