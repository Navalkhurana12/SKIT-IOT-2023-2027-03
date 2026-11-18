
import { Menu, UserRound, Bell } from "lucide-react";

export default function Navbar({
  activePage,
  user,
  role,
  setSidebarOpen,
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-8">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-lg font-bold text-[#102C57] sm:text-xl">
            {activePage || "Dashboard"}
          </h2>

          <p className="hidden text-xs text-slate-500 sm:block">
            SKIT IoT Inventory Management System
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-5">

        <button
          className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-9 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <UserRound size={20} />
          </div>

          <div className="hidden sm:block">
            <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
              {user?.name || "User"}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {role || "Student"}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
