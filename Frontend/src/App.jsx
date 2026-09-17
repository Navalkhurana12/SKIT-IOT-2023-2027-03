
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Info,
  FolderKanban,
  CalendarDays,
  Package,
  Cpu,
  ArrowRight,
  Search,
  UserRound,
  Boxes,
  Users,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";

import logo from "./assets/logo.png";
import skitImage from "./assets/SKIT.jpeg";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", id: "home", icon: Home },
    { name: "About Us", id: "about", icon: Info },
    { name: "Projects", id: "projects", icon: FolderKanban },
    { name: "Events", id: "events", icon: CalendarDays },
    { name: "Inventory", id: "inventory", icon: Package },
    { name: "IoT Lab", id: "iot-lab", icon: Cpu },
  ];

  const features = [
    {
      title: "Home",
      description: "Overview of IoT Lab, recent updates and quick access.",
      icon: Home,
      color: "blue",
      id: "home",
    },
    {
      title: "About Us",
      description: "Learn about our IoT lab, facilities and team.",
      icon: Info,
      color: "purple",
      id: "about",
    },
    {
      title: "Projects",
      description: "Explore student projects and innovation.",
      icon: FolderKanban,
      color: "green",
      id: "projects",
    },
    {
      title: "Events",
      description: "Workshops, hackathons and upcoming events.",
      icon: CalendarDays,
      color: "orange",
      id: "events",
    },
    {
      title: "Inventory",
      description: "Track IoT components, issue and manage stock.",
      icon: Package,
      color: "red",
      id: "inventory",
    },
    {
      title: "IoT Lab",
      description: "Lab equipment, bookings and resources.",
      icon: Cpu,
      color: "cyan",
      id: "iot-lab",
    },
  ];

  const stats = [
    {
      title: "Total Inventory Items",
      value: "248",
      icon: Package,
    },
    {
      title: "Active Projects",
      value: "24",
      icon: FolderKanban,
    },
    {
      title: "Upcoming Events",
      value: "5",
      icon: CalendarDays,
    },
    {
      title: "Registered Users",
      value: "120+",
      icon: Users,
    },
  ];

  const events = [
    {
      date: "20",
      month: "APR",
      title: "IoT Workshop: Smart Home Systems",
      time: "10:00 AM – 1:00 PM",
      location: "IoT Lab",
      type: "Workshop",
    },
    {
      date: "27",
      month: "APR",
      title: "Hackathon 2025",
      time: "9:00 AM – 6:00 PM",
      location: "Seminar Hall",
      type: "Hackathon",
    },
    {
      date: "05",
      month: "MAY",
      title: "Tech Talk: Future of IoT",
      time: "11:00 AM – 12:30 PM",
      location: "Online",
      type: "Talk",
    },
  ];

  const projects = [
    {
      title: "Smart Irrigation System",
      description: "Automated plant watering using soil moisture sensors and IoT.",
      status: "In Progress",
      icon: "🌱",
    },
    {
      title: "Home Automation",
      description: "Control home appliances using ESP32 and IoT.",
      status: "Completed",
      icon: "🏠",
    },
    {
      title: "Weather Monitoring Station",
      description: "Real-time temperature, humidity and weather data collection.",
      status: "In Progress",
      icon: "🌤️",
    },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-emerald-100 text-emerald-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
      cyan: "bg-cyan-100 text-cyan-600",
    };

    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-3 sm:px-8 lg:px-12">

          {/* Logo and College Name */}

          <button
            onClick={() => scrollToSection("home")}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <img
              src={logo}
              alt="SKIT College Logo"
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
            />

            <div className="hidden min-[420px]:block">
              <h1 className="max-w-[280px] font-serif text-sm font-bold leading-tight text-[#102C57] sm:text-base lg:text-lg">
                Swami Keshvanand Institute
                <br />
                of Technology
              </h1>

              <p className="mt-1 text-[9px] tracking-wide text-slate-500 sm:text-[10px]">
                Technology&nbsp; | &nbsp;Innovation&nbsp; | &nbsp;Excellence
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
                  className="group flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 xl:px-4"
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}

          <div className="hidden items-center gap-3 sm:flex">
            <button
              aria-label="Search"
              className="rounded-full p-2.5 text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <Search size={21} />
            </button>

            <button
              onClick={() => alert("Login page coming soon!")}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
            >
              <UserRound size={16} />
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

        {/* Mobile Navigation */}

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Icon size={18} />
                    {item.name}
                  </button>
                );
              })}

              <button
                onClick={() => alert("Login page coming soon!")}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
              >
                <UserRound size={17} />
                Login
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}

      <section
        id="home"
        className="relative isolate flex min-h-[540px] items-center overflow-hidden bg-[#092854] lg:min-h-[500px]"
      >
        {/* Background Image */}

        <img
          src={skitImage}
          alt="SKIT College Campus"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        {/* Dark Overlay */}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#031b43]/95 via-[#062b59]/80 to-[#062b59]/25" />

        <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-10 lg:px-16">

          <div className="max-w-3xl text-white">

            {/* Badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-500/30 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Cpu size={18} className="text-blue-200" />
              SKIT IoT Lab
            </div>

            {/* Heading */}

            <h2 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to the
              <span className="mt-2 block text-blue-400">
                IoT Inventory
                <br className="hidden sm:block" />
                Management System
              </span>
            </h2>

            {/* Description */}

            <p className="mt-6 max-w-2xl text-base leading-7 text-blue-50/90 sm:text-lg">
              Manage your IoT components, explore student projects,
              track upcoming events and make the most of our IoT lab
              resources — all in one place.
            </p>

            {/* Buttons */}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollToSection("inventory")}
                className="group flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
              >
                Explore Now
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => scrollToSection("about")}
                className="rounded-full border border-white/60 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-blue-900"
              >
                Learn More
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURE CARDS ================= */}

      <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-5 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <button
                key={feature.id}
                onClick={() => scrollToSection(feature.id)}
                className="group flex min-h-[205px] flex-col items-start rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${getColorClasses(feature.color)}`}
                >
                  <Icon size={23} strokeWidth={1.8} />
                </div>

                <h3 className="text-lg font-bold text-[#102C57]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>

                <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-blue-600">
                  Explore
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </button>
            );
          })}

        </div>
      </section>

      {/* ================= OVERVIEW ================= */}

      <section className="mx-auto max-w-[1600px] px-5 pb-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.2fr_1.2fr]">

          {/* Quick Stats */}

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Boxes className="text-blue-600" size={22} />
              <h3 className="text-lg font-bold text-[#102C57]">
                Quick Stats
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="border-b border-slate-100 pb-4"
                  >
                    <Icon size={22} className="mb-3 text-blue-600" />

                    <p className="text-2xl font-bold text-[#102C57]">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {stat.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}

          <div
            id="events"
            className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-blue-600" size={22} />
                <h3 className="text-lg font-bold text-[#102C57]">
                  Upcoming Events
                </h3>
              </div>

              <button
                onClick={() => alert("Events page coming soon!")}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View All
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {events.map((event) => (
                <div
                  key={event.title}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex h-[66px] w-[58px] shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <span className="text-xl font-bold">{event.date}</span>
                    <span className="text-[10px] font-bold">{event.month}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[#102C57]">
                      {event.title}
                    </h4>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {event.time}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {event.location}
                      </span>
                    </div>

                    <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}

          <div
            id="projects"
            className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FolderKanban className="text-blue-600" size={22} />
                <h3 className="text-lg font-bold text-[#102C57]">
                  Featured Projects
                </h3>
              </div>

              <button
                onClick={() => alert("Projects page coming soon!")}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View All
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-3xl">
                    {project.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#102C57]">
                        {project.title}
                      </h4>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                        {project.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= PLACEHOLDER MODULE SECTIONS ================= */}

      <section
        id="about"
        className="scroll-mt-24 border-t border-slate-200 bg-white px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <Info className="mx-auto mb-4 text-blue-600" size={32} />
          <h2 className="text-3xl font-bold text-[#102C57]">About Us</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            The SKIT IoT Lab supports hands-on learning, experimentation
            and innovation in Internet of Things technologies.
          </p>
        </div>
      </section>

      <section
        id="inventory"
        className="scroll-mt-24 border-t border-slate-200 bg-slate-50 px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <Package className="mx-auto mb-4 text-blue-600" size={32} />
          <h2 className="text-3xl font-bold text-[#102C57]">Inventory</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Manage IoT components, track stock availability and monitor
            equipment issued to student projects.
          </p>
          <button
            onClick={() => alert("Inventory management coming soon!")}
            className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open Inventory
          </button>
        </div>
      </section>

      <section
        id="iot-lab"
        className="scroll-mt-24 border-t border-slate-200 bg-white px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <Cpu className="mx-auto mb-4 text-blue-600" size={32} />
          <h2 className="text-3xl font-bold text-[#102C57]">IoT Lab</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Explore laboratory facilities, equipment resources and
            lab activities.
          </p>
        </div>
      </section>

      {/* ================= FOOTER =================

      <footer className="bg-[#102C57] px-5 py-8 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 text-center text-xs text-blue-100 sm:flex-row sm:text-left">
          <p>
            © 2026 SKIT IoT Lab. All rights reserved.
          </p>

          <p>
            Swami Keshvanand Institute of Technology, Jaipur
          </p>

          <p className="italic text-blue-200">
            Innovating for a Smarter Tomorrow
          </p>
        </div>
      </footer> */}

    </div>
  );
}

export default App;