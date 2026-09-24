import { useState } from "react";
import {
  Menu,
  X,
  Search,
  UserRound,
} from "lucide-react";

import logo from "../assets/logo.png";
import { navItems } from "../data/homeData";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-3 sm:px-8 lg:px-12">

        {/* Logo + College Name */}

        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-3 text-left"
        >
          <img
            src={logo}
            alt="SKIT Logo"
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />

          <div className="hidden min-[420px]:block">
            <h1 className="font-serif text-sm font-bold leading-tight text-[#102C57] sm:text-base lg:text-lg">
              Swami Keshvanand Institute
              <br />
              of Technology
            </h1>

            <p className="mt-1 text-[9px] tracking-wide text-slate-500 sm:text-[10px]">
              Technology | Innovation | Excellence
            </p>
          </div>

          <span className="font-serif text-sm font-bold text-[#102C57] min-[420px]:hidden">
            SKIT
          </span>
        </button>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 xl:px-4"
              >
                <Icon size={17} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Right Side */}

        <div className="hidden items-center gap-3 sm:flex">
          <button className="rounded-full p-2.5 hover:bg-slate-100">
            <Search size={21} />
          </button>

          <button
            onClick={() => alert("Login page coming soon!")}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <UserRound size={16} />
            Login
          </button>
        </div>

        {/* Mobile Menu */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 lg:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navbar */}

      {menuOpen && (
        <div className="border-t bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-blue-50"
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}

            <button className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-white">
              Login
            </button>

          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;