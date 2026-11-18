
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Package,
  ClipboardList,
  Clock,
  CheckCircle,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import StatCard from "../components/dashboard/StatCard";

import api from "../services/api";
import { logoutUser } from "../features/auth/authSlice";

export default function StudentDashboard() {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState([
    {
      title: "Available Components",
      value: 0,
      icon: Package,
      color: "blue",
      description: "Total units available in lab",
    },
    {
      title: "My Requests",
      value: 0,
      icon: ClipboardList,
      color: "purple",
      description: "Total issue requests",
    },
    {
      title: "Pending Requests",
      value: 0,
      icon: Clock,
      color: "orange",
      description: "Waiting for approval",
    },
    {
      title: "Issued Components",
      value: 0,
      icon: CheckCircle,
      color: "green",
      description: "Currently issued to you",
    },
  ]);

  // FETCH DASHBOARD DATA
  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [componentResponse, requestResponse] =
          await Promise.all([
            api.get("/components"),
            api.get("/issue-requests/my"),
          ]);

        console.log(
  "COMPONENT API:",
  JSON.stringify(componentResponse.data, null, 2)
);

console.log(
  "REQUEST API:",
  JSON.stringify(requestResponse.data, null, 2)
);

        const components =
          componentResponse.data?.components;

        const requests =
          requestResponse.data?.requests;

        if (!Array.isArray(components)) {
          throw new Error(
            "Invalid components API response"
          );
        }

        if (!Array.isArray(requests)) {
          throw new Error(
            "Invalid issue requests API response"
          );
        }

        // Total available units in lab
        const availableComponents = components.reduce(
          (total, component) => {
            return total + Number(component.quantity || 0);
          },
          0
        );

        // Total student requests
        const totalRequests = requests.length;

        // Pending requests
        const pendingRequests = requests.filter(
          (request) => request.status === "pending"
        ).length;

        // Currently issued component units
        const issuedComponents = requests
          .filter(
            (request) => request.status === "approved"
          )
          .reduce((total, request) => {
            const itemQuantity = (
              request.items || []
            ).reduce((sum, item) => {
              return sum + Number(item.quantity || 0);
            }, 0);

            return total + itemQuantity;
          }, 0);

        if (isMounted) {
          setStats([
            {
              title: "Available Components",
              value: availableComponents,
              icon: Package,
              color: "blue",
              description: "Total units available in lab",
            },
            {
              title: "My Requests",
              value: totalRequests,
              icon: ClipboardList,
              color: "purple",
              description: "Total issue requests",
            },
            {
              title: "Pending Requests",
              value: pendingRequests,
              icon: Clock,
              color: "orange",
              description: "Waiting for approval",
            },
            {
              title: "Issued Components",
              value: issuedComponents,
              icon: CheckCircle,
              color: "green",
              description: "Currently issued to you",
            },
          ]);
        }
      } catch (err) {
        console.error("Dashboard Error:", err);

        if (isMounted) {
          setError(
            err.response?.data?.message ||
            err.message ||
            "Unable to load dashboard data"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // LOGOUT
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

  // DASHBOARD CONTENT
  const DashboardOverview = () => (
    <>
      <div>
        <h2 className="text-2xl font-bold text-[#102C57]">
          Welcome, {user?.name || "Student"}!
        </h2>

        <p className="mt-2 text-slate-500">
          Manage your IoT lab components and issue requests.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* STATISTICS */}
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

      {/* STUDENT INFORMATION */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#102C57]">
          Student Information
        </h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Full Name</p>
            <p className="mt-1 font-semibold text-slate-800">
              {user?.name || "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Roll Number</p>
            <p className="mt-1 font-semibold text-slate-800">
              {user?.rollNo || "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-800">
              {user?.email || "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="mt-1 font-semibold text-slate-800">
              {user?.phone || "Not available"}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-[#102C57]">
          Quick Actions
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() =>
              setActivePage("Browse Components")
            }
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <Package className="text-blue-600" size={28} />

            <div>
              <h4 className="font-semibold text-slate-800">
                Browse Components
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Explore available IoT components
              </p>
            </div>
          </button>

          <button
            onClick={() => setActivePage("My Requests")}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <ClipboardList
              className="text-purple-600"
              size={28}
            />

            <div>
              <h4 className="font-semibold text-slate-800">
                My Requests
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Track your issue requests
              </p>
            </div>
          </button>
        </div>
      </div>
    </>
  );

  // TEMPORARY SECTIONS
  const renderContent = () => {
    if (activePage === "Dashboard") {
      return <DashboardOverview />;
    }

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
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="user"
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      <div className="min-w-0 flex-1">
        <Navbar
          activePage={activePage}
          user={user}
          role="Student"
          setSidebarOpen={setSidebarOpen}
        />

        <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
