import { ArrowRight, Cpu } from "lucide-react";
import skitImage from "../assets/SKIT.jpeg";

function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[540px] items-center overflow-hidden bg-[#092854]"
    >
      {/* Background */}

      <img
        src={skitImage}
        alt="SKIT Campus"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#031b43]/95 via-[#062b59]/80 to-[#062b59]/25" />

      {/* Content */}

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-10 lg:px-16">

        <div className="max-w-3xl text-white">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-500/30 px-4 py-2 text-sm backdrop-blur-sm">
            <Cpu size={18} />
            SKIT IoT Lab
          </div>

          <h2 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Welcome to the

            <span className="mt-2 block text-blue-400">
              IoT Inventory
              <br />
              Management System
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-blue-50/90 sm:text-lg">
            Manage your IoT components, explore student projects,
            track upcoming events and make the most of our IoT lab
            resources — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button
              onClick={() => scrollToSection("inventory")}
              className="group flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-500"
            >
              Explore Now

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="rounded-full border border-white/60 px-6 py-3.5 font-semibold hover:bg-white hover:text-blue-900"
            >
              Learn More
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;