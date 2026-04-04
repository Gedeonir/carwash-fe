import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./UI";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location);
  

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-surface-50 backdrop-blur-md border-b border-white/6">
      <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 py-4">
        <div className="font-display text-2xl text-surface-900">
          Ikinamba<span className="text-primary-500">.</span>
        </div>
        <div className="hidden md:flex gap-8 ml-10">
          {[
            ["Home","/"],
            ["Services", "/our-services"],
            ["How it works", "#"],
            ["Pricing", "#"],
            ["Contact", "#"],
          ].map(([l, p]) => (
            <a
              key={l}
              href={p}
              onClick={(e) => {
                e.preventDefault();
                if(p) navigate(p)
                ;
              }}
              className={`text-sm hover:text-primary-500 transition-colors ${location.pathname === p ? "text-primary-500" : "text-surface-400"}`}
            >
              {l}
            </a>
          ))}
        </div>
        <div className="ml-auto flex gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate("/auth")}>
            Book Now
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
