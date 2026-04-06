import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./UI";
import { Menu } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = React.useState(false);
  const links = [
    ["Home", "/"],
    ["Services", "/our-services"],
    ["How it works", "#"],
    ["Pricing", "#"],
    ["Contact", "#"],
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-surface-50 backdrop-blur-md border-b border-white/6">
      <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 py-4">
        <div className="font-display text-2xl text-surface-900">
          Ikinamba<span className="text-primary-500">.</span>
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
          onClick={() => setOpen(!open)}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 bg-surface-50">
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
