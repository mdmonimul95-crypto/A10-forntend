"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Calendar, Eye, CheckCircle2, UserX, Trash2, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ReportedProductsAdminPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`);
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${reportId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update report");

      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update report status.");
    }
  };

  const handleAction = async (actionType, report) => {
    if (actionType === "inspect") {
      toast.info(`Viewing product ${report.productId} (details page coming soon).`);
      return;
    }

    if (actionType === "remove") {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${report.productId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete product");
        toast.success("Product removed from marketplace.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove product.");
        return;
      }
    }

    // dismiss, warn, and remove all mark the report as resolved
    await updateReportStatus(report._id, "resolved");
    toast.success(`Action: ${actionType} applied successfully.`);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">
      {/* Header Title Section */}
      <div className="mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Reported Products Review Panel
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review community reports, warn sellers, dismiss complaints, or remove listings.
        </p>
      </div>

      {/* Reported Items List Wrapper */}
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No reported products at the moment.
          </div>
        ) : (
          reports.map((report) => (
            <div 
              key={report._id}
              className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-xs shadow-xl flex flex-col gap-4"
            >
              {/* Top Meta: Reason Badge, Status Badge & Date */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/40 text-red-400 border border-red-900/40 tracking-wider">
                    <AlertTriangle className="size-3.5" />
                    REASON: {report.reason}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider border capitalize ${
                    report.status === "resolved"
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/40"
                      : "bg-amber-950/30 text-amber-400 border-amber-900/40"
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                  <Calendar className="size-4 shrink-0" />
                  <span>
                    Reported on {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>

              {/* Product Title & Seller */}
              <div>
                <h2 className="text-lg font-bold text-zinc-100 tracking-wide">
                  Product: <span className="font-semibold text-zinc-300">{report.productTitle}</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Seller: <span className="text-zinc-400 font-medium">{report.sellerName}</span>
                </p>
              </div>

              {/* Report Details Box */}
              <div className="w-full p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-sm">
                <span className="text-zinc-500 font-medium">Report Details: </span>
                <span className="text-zinc-300 font-normal">{report.reportDetails}</span>
              </div>

              {/* Bottom Row: Reporter Info & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-zinc-800/30">
                {/* Reported By Info */}
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <User className="size-4 text-zinc-600 shrink-0" />
                  <span>Reported by: <span className="text-zinc-400 font-semibold">{report.reportedByEmail}</span></span>
                </div>

                {/* Action Buttons Group */}
                <div className="flex items-center flex-wrap gap-2">
                  {/* Inspect Button */}
                  <button
                    onClick={() => handleAction("inspect", report)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 transition-all cursor-pointer"
                  >
                    <Eye className="size-4 text-zinc-400" />
                    <span>Inspect</span>
                  </button>

                  {/* Dismiss Button */}
                  <button
                    onClick={() => handleAction("dismiss", report)}
                    disabled={report.status === "resolved"}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-950/20 disabled:hover:text-emerald-400"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Dismiss</span>
                  </button>

                  {/* Warn Seller Button */}
                  <button
                    onClick={() => handleAction("warn", report)}
                    disabled={report.status === "resolved"}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-950/20 border border-amber-900/30 text-amber-500 hover:bg-amber-600 hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-950/20 disabled:hover:text-amber-500"
                  >
                    <UserX className="size-4" />
                    <span>Warn Seller</span>
                  </button>

                  {/* Remove Product Button */}
                  <button
                    onClick={() => handleAction("remove", report)}
                    disabled={report.status === "resolved"}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-950/30 disabled:hover:text-red-400"
                  >
                    <Trash2 className="size-4" />
                    <span>Remove Product</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}