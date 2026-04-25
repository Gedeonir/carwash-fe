import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./UI";
import { Menu, Bell } from "lucide-react";
import logo from "../assets/car_wash_logo.png";
import { useAuth } from "../context/UseAuth";
import { useBookingStore } from "../utils/bookingStore";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = React.useState(false);
  const links = [
    ["Home", "/"],
    ["Services & Pricing", "/our-services"],
    ["Get in Touch", "/contact"],
  ];

  const {user} = useAuth();

  const [notifCount] = useState(2);
  const resetBooking = useBookingStore((state) => state.resetBooking);
  
  

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-surface-50 backdrop-blur-md border-b border-white/6">
      <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 py-4">
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
        <div className="hidden md:flex gap-8 ml-10">
          {links.map(([l, p]) => (
            <a
              key={l}
              href={p}
              onClick={(e) => {
                e.preventDefault();
                if (p) navigate(p);
              }}
              className={`text-sm hover:text-primary-500 transition-colors ${location.pathname === p ? "text-primary-500" : "text-surface-400"}`}
            >
              {l}
            </a>
          ))}
          {user && (
            <a
              href={"/dashboard"}
              onClick={(e) => {
                e.preventDefault();
                navigate("/dashboard");
              }}
              className={`text-sm hover:text-primary-500 transition-colors ${location.pathname === "/dashboard" ? "text-primary-500" : "text-surface-400"}`}
            >
              My Dashboard
            </a>
          )}
        </div>
        <div className="hidden md:flex ml-auto gap-3">
          {!location.pathname.includes("booking") && (
            <Button
              size="sm"
              onClick={() => {
                (resetBooking(), navigate("/booking"));
              }}
            >
              Book Now
            </Button>
          )}
          {user ? (
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
                className="w-9 h-9 rounded-full bg-primary-500 border border-primary-500/30 flex items-center justify-center font-display text-primary-50 text-sm hover:bg-primary-500/30 transition-all"
              >
                {user?.initials}
              </button>
            </div>
          ) : (
            location.pathname !== "/auth" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigate("/auth", { state: { screen: "login" } })
                }
              >
                Sign In
              </Button>
            )
          )}
        </div>

        <Button
          className="ml-auto md:hidden"
          variant="outline"
          size="sm"
          onClick={() => setOpen(!open)}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 bg-surface-50 min-h-screen">
          {links.map(([l, p]) => (
            <a
              key={l}
              href={p}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                if (p) navigate(p);
              }}
              className={`text-sm ${
                location.pathname === p
                  ? "text-primary-500"
                  : "text-surface-400"
              }`}
            >
              {l}
            </a>
          ))}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false);
                navigate("/auth", { state: { screen: "login" } });
              }}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setOpen(false);
                navigate("/auth", { state: { screen: "choose" } });
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
