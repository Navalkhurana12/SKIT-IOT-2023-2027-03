
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  RotateCcw,
  Boxes,
  AlertTriangle,
  BarChart3,
  LogOut,
  UserRound,
  X,
} from "lucide-react";

export default function Sidebar({
  role,
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
  user,
  onLogout,
}) {
  const isAdmin = role === "admin";

  const studentMenu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Browse Components", icon: Package },
    { name: "Cart", icon: ShoppingCart },
    { name: "My Requests", icon: ClipboardList },
    { name: "Return Status", icon: RotateCcw },
  ];

  const adminMenu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Inventory Management", icon: Boxes },
    { name: "Low Stock Alerts", icon: AlertTriangle },
    { name: "Pending Requests", icon: ClipboardList },
    { name: "Return Management", icon: RotateCcw },
    { name: "Overdue Requests", icon: AlertTriangle },
    { name: "Student Reports", icon: BarChart3 },
  ];

  const menuItems = isAdmin ? adminMenu : studentMenu;

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#102C57] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div>
            <h1 className="text-xl font-bold">SKIT IoT</h1>
            <p className="text-sm text-blue-200">Inventory System</p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={23} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-5 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-300">
            {isAdmin ? "Admin Panel" : "Student Panel"}
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActivePage(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition ${
                    active
                      ? "bg-white font-semibold text-[#102C57]"
                      : "text-blue-100 hover:bg-white/10"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User and Logout */}
        <div className="mt-auto border-t border-white/10 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <UserRound size={21} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.name || "User"}
              </p>
              <p className="text-xs capitalize text-blue-200">
                {role || "Student"}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/30"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
