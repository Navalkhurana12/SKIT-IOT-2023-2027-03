
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Boxes,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import StatCard from "../components/dashboard/StatCard";

import InventoryManagement from "../components/admin/InventoryManagement";
import PendingRequests from "../components/admin/PendingRequests";

import api from "../services/api";
import { logoutUser } from "../features/auth/authSlice";

export default function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState([
    {
      title: "Total Components",
      value: "—",
      icon: Package,
      color: "blue",
      description: "Different components in inventory",
    },
    {
      title: "Total Stock Units",
      value: "—",
      icon: Boxes,
      color: "green",
      description: "Total available units",
    },
    {
      title: "Pending Requests",
      value: "—",
      icon: ClipboardList,
      color: "orange",
      description: "Waiting for approval",
    },
    {
      title: "Overdue Requests",
      value: "—",
      icon: AlertTriangle,
      color: "red",
      description: "Requests past due date",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        componentResponse,
        requestResponse,
        overdueResponse,
      ] = await Promise.all([
        api.get("/components"),
        api.get("/issue-requests"),
        api.get("/issue-requests/overdue"),
      ]);

      const components =
        componentResponse.data.components || [];

      const requests =
        requestResponse.data.requests || [];

      const overdueRequests =
        overdueResponse.data.requests || [];

      const totalComponents = components.length;

      const totalStockUnits = components.reduce(
        (total, component) =>
          total + Number(component.quantity || 0),
        0
      );

      const pendingRequests = requests.filter(
        (request) => request.status === "pending"
      ).length;

      setStats([
        {
          title: "Total Components",
          value: totalComponents,
          icon: Package,
          color: "blue",
          description: "Different components in inventory",
        },
        {
          title: "Total Stock Units",
          value: totalStockUnits,
          icon: Boxes,
          color: "green",
          description: "Total available units",
        },
        {
          title: "Pending Requests",
          value: pendingRequests,
          icon: ClipboardList,
          color: "orange",
          description: "Waiting for approval",
        },
        {
          title: "Overdue Requests",
          value: overdueRequests.length,
          icon: AlertTriangle,
          color: "red",
          description: "Requests past due date",
        },
      ]);
    } catch (err) {
      console.error("Admin Dashboard API Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial dashboard loading
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      dispatch(logoutUser());
      navigate("/login", { replace: true });
    }
  };

  // Dashboard Overview
  const DashboardOverview = () => {
    return (
      <>
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#102C57]">
            Welcome, {user?.name || "Admin"}!
          </h2>

          <p className="mt-2 text-slate-500">
            Manage your IoT inventory, student requests and lab stock.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={loading ? "..." : item.value}
              icon={item.icon}
              color={item.color}
              description={item.description}
            />
          ))}
        </div>

        {/* Admin Information */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#102C57]">
            Admin Information
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">
                Name
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {user?.name || "Administrator"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {user?.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Role
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-bold text-[#102C57]">
            Quick Actions
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() =>
                setActivePage("Inventory Management")
              }
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <Package
                className="text-blue-600"
                size={28}
              />

              <div>
                <h4 className="font-semibold text-slate-800">
                  Manage Inventory
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Add and manage IoT components
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                setActivePage("Pending Requests")
              }
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <ClipboardList
                className="text-purple-600"
                size={28}
              />

              <div>
                <h4 className="font-semibold text-slate-800">
                  Pending Requests
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Review student issue requests
                </p>
              </div>
            </button>
          </div>
        </div>
      </>
    );
  };

  // Render selected section
  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <DashboardOverview />;

      case "Inventory Management":
        return <InventoryManagement />;

      case "Pending Requests":
        return <PendingRequests />;

      default:
        return (
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#102C57]">
              {activePage}
            </h2>

            <p className="mt-3 text-slate-500">
              This section will be connected in the next development step.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar
        role="admin"
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="min-w-0 flex-1">

        {/* Navbar */}
        <Navbar
          activePage={activePage}
          user={user}
          role="Admin"
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page Content */}
        <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8">
          {renderContent()}
        </main>

      </div>
    </div>
  );
}
