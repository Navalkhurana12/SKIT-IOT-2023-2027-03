
import { useState, useEffect, useCallback } from "react";

import {
  ClipboardList,
  RefreshCw,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Mail,
  Package,
  CalendarDays,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";

import api from "../../services/api";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch all requests and show only pending ones
  const fetchRequests = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/issue-requests");

      const allRequests = response.data.requests || [];

      const pendingRequests = allRequests.filter(
        (request) => request.status === "pending"
      );

      setRequests(pendingRequests);
    } catch (err) {
      console.error("Pending Requests Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load pending requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Approve request
  const handleApprove = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this request?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(requestId);
      setError("");
      setSuccess("");

      await api.patch(
        `/issue-requests/${requestId}/approve`
      );

      setSuccess("Request approved successfully!");

      await fetchRequests(true);
    } catch (err) {
      console.error("Approve Request Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to approve this request."
      );
    } finally {
      setActionLoading("");
    }
  };

  // Open reject modal
  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setError("");
  };

  // Close reject modal
  const closeRejectModal = () => {
    setSelectedRequest(null);
    setRejectionReason("");
  };

  // Reject request
  const handleReject = async (e) => {
    e.preventDefault();

    if (!rejectionReason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    const requestId = selectedRequest?._id;

    if (!requestId) return;

    try {
      setActionLoading(requestId);
      setError("");
      setSuccess("");

      await api.patch(
        `/issue-requests/${requestId}/reject`,
        {
          rejectionReason: rejectionReason.trim(),
        }
      );

      closeRejectModal();

      setSuccess("Request rejected successfully!");

      await fetchRequests(true);
    } catch (err) {
      console.error("Reject Request Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to reject this request."
      );
    } finally {
      setActionLoading("");
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get student details
  const getStudentName = (request) => {
    return (
      request.name ||
      request.user?.name ||
      request.studentName ||
      "Unknown Student"
    );
  };

  const getStudentRollNo = (request) => {
    return (
      request.rollNo ||
      request.user?.rollNo ||
      request.student?.rollNo ||
      "Not available"
    );
  };

  const getStudentPhone = (request) => {
    return (
      request.phone ||
      request.user?.phone ||
      request.student?.phone ||
      "Not available"
    );
  };

  const getStudentEmail = (request) => {
    return (
      request.email ||
      request.user?.email ||
      request.student?.email ||
      "Not available"
    );
  };

  // Get requested components
  const getRequestItems = (request) => {
    if (Array.isArray(request.items)) {
      return request.items;
    }

    if (Array.isArray(request.components)) {
      return request.components;
    }

    // Support older single-component request format
    if (request.component || request.componentName) {
      return [request];
    }

    return [];
  };

  // Get component name
  const getComponentName = (item) => {
    if (typeof item.component === "object" && item.component !== null) {
      return (
        item.componentName ||
        item.component.name ||
        "Unknown Component"
      );
    }

    return (
      item.componentName ||
      item.name ||
      "Unknown Component"
    );
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <ClipboardList
                size={25}
                className="text-blue-700"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#102C57]">
                Pending Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage student component requests.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchRequests(true)}
          disabled={refreshing || loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle size={19} />
          <p>{success}</p>
        </div>
      )}

      {/* Pending Count */}
      <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-700">
              Total Pending Requests
            </p>

            <h3 className="mt-1 text-3xl font-bold text-orange-800">
              {loading ? "..." : requests.length}
            </h3>
          </div>

          <div className="rounded-full bg-orange-100 p-3">
            <ClipboardList
              size={27}
              className="text-orange-600"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading pending requests...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && !error && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle
              size={32}
              className="text-green-600"
            />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            No Pending Requests
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            All student requests have been processed.
          </p>
        </div>
      )}

      {/* Requests List */}
      {!loading && requests.length > 0 && (
        <div className="space-y-5">
          {requests.map((request, index) => {
            const items = getRequestItems(request);

            const isProcessing =
              actionLoading === request._id;

            return (
              <div
                key={request._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Request Header */}
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Request #{index + 1}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      ID: {request._id}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      Pending
                    </span>

                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <CalendarDays size={14} />
                      {formatDate(request.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="p-5">

                  {/* Student Information */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-[#102C57]">
                      <User size={19} />
                      Student Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-500">
                          Student Name
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {getStudentName(request)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Roll Number
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {getStudentRollNo(request)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Phone
                        </p>

                        <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
                          <Phone size={14} className="text-slate-400" />
                          {getStudentPhone(request)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Email
                        </p>

                        <p className="mt-1 flex items-center gap-2 break-all font-semibold text-slate-800">
                          <Mail size={14} className="shrink-0 text-slate-400" />
                          {getStudentEmail(request)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requested Components */}
                  <div className="mt-7">
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-[#102C57]">
                      <Package size={19} />
                      Requested Components ({items.length})
                    </h3>

                    {items.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full min-w-[400px] text-left text-sm">
                          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                              <th className="px-4 py-3">
                                Component Name
                              </th>

                              <th className="px-4 py-3 text-center">
                                Quantity
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100">
                            {items.map((item, itemIndex) => (
                              <tr key={item._id || itemIndex}>
                                <td className="px-4 py-3 font-medium text-slate-800">
                                  {getComponentName(item)}
                                </td>

                                <td className="px-4 py-3 text-center font-semibold text-slate-700">
                                  {item.quantity || 0}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                        No component details available.
                      </p>
                    )}
                  </div>

                  {/* Request Reason */}
                  <div className="mt-6">
                    <h3 className="mb-2 font-bold text-[#102C57]">
                      Request Reason
                    </h3>

                    <div className="rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                      {request.reason || "No reason provided."}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                    <button
                      onClick={() => openRejectModal(request)}
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Reject
                    </button>

                    <button
                      onClick={() => handleApprove(request._id)}
                      disabled={isProcessing}
                      className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw
                            size={17}
                            className="animate-spin"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={17} />
                          Approve Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-100 p-2">
                  <XCircle
                    size={22}
                    className="text-red-600"
                  />
                </div>

                <h3 className="text-lg font-bold text-[#102C57]">
                  Reject Request
                </h3>
              </div>

              <button
                onClick={closeRejectModal}
                disabled={actionLoading === selectedRequest._id}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Please provide a reason for rejecting this student's request.
            </p>

            <form onSubmit={handleReject}>
              <textarea
                rows="4"
                value={rejectionReason}
                onChange={(e) =>
                  setRejectionReason(e.target.value)
                }
                placeholder="Enter rejection reason..."
                required
                className="mt-4 w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={actionLoading === selectedRequest._id}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    !rejectionReason.trim() ||
                    actionLoading === selectedRequest._id
                  }
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading === selectedRequest._id ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Confirm Reject
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
