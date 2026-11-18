
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email signup page se receive hoga
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email not found. Please signup again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSuccess("Email verified successfully! Redirecting...");

        // Update authentication state from backend
        await api.get("/auth/me", {
          withCredentials: true,
        });

        // Redirect to dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#102C57]">
            Verify Your Email
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            We have sent a 6-digit OTP to
          </p>

          <p className="mt-1 font-semibold text-blue-600">
            {email || "Email not available"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Enter OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit OTP"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            Login
          </Link>
        </p>

        <Link
          to="/signup"
          className="mt-4 block text-center text-sm text-slate-500 hover:text-blue-600"
        >
          Back to Signup
        </Link>

      </div>
    </div>
  );
}
