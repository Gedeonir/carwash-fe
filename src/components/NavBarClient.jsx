import React, { useState } from "react";
import logo from "../assets/car_wash_logo.png";
import { useAuth } from "../context/UseAuth";
import { Card, Badge, Button } from "../components/UI";
import { Bell, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavBarClient = () => {
  const user = useAuth();
  const userName = user.name || "Amira";
  const firstName = userName.split(" ")[0].split("@")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [notifCount] = useState(2);
  const navigate=useNavigate();
  return (
    <div className="sticky top-0 z-40 bg-surface-50 backdrop-blur-md border-b border-white/6">
      <div className="mx-auto flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative rounded-full overflow-hidden">
            <img
              src={logo}
              alt="Ikinamba Logo"
              className="w-full h-full object-cover drop-shadow-[0_20px_40px_rgba(0,201,177,0.12)]"
            />
          </div>
          <div className="font-display text-lg text-surface-900">
            Mobile Ikinamba<span className="text-primary-500">.</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            onClick={() => navigate("/notifications")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full border border-white/8 hover:border-primary-500/40 transition-all"
          >
            <Bell className="w-5 h-5 text-surface-400" />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary-500 rounded-full text-[3px] font-bold text-surface-900 flex items-center justify-center"></span>
            )}
          </button>
          {/* Avatar */}
          <button
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-primary-500 border border-primary-500/30 flex items-center justify-center font-display text-primary-400 text-sm hover:bg-primary-500/30 transition-all"
          >
            {firstName[0].toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBarClient;
