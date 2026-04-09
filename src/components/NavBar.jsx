import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./UI";
import { Menu } from "lucide-react";
import { toast } from "./Toast";
import logo from "../assets/car_wash_logo.png";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = React.useState(false);
  const links = [
    ["Home", "/"],
    ["Services & Pricing", "/our-services"],
    ["Get in Touch", "/contact"],
  ];

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
        </div>
        <div className="hidden md:flex ml-auto gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate("/auth")}>
            Book Now
          </Button>
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
                navigate("/auth");
              }}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setOpen(false);
                navigate("/auth");
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
