import React from "react";
import { useNavigate,useLocation} from "react-router-dom";
import { Button } from "./UI";

const SuccessDialogBox = ({ title, message, onNavigate, onClose, btnText }) => {
  const navigate = useNavigate();
  const location=useLocation();
  return (
    <div className="fixed inset-0 px-8 bg-surface-900 bg-opacity-10 z-50 flex flex-col items-center justify-center">
      <div className="bg-surface-50 w-full md:w-2/5 px-4 py-8 flex flex-col items-center justify-content rounded-lg">
        <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center mb-6">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00C9B1"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h2 className="font-display text-lg text-surface-900 mb-2">{title}</h2>
        <p className="text-surface-500 text-sm">{message}</p>

        <div className="flex gap-4 w-full justify-center mt-6">
          <Button size="sm" onClick={onNavigate}>
            {btnText} →
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialogBox;
