"use client";

import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  UserX, 
  Trash2, 
  User, 
  Loader2,
  RefreshCw,
  Filter,
  Search,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function ReportedProductsAdminPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Use next-themes hook
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/reports`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReports(data);
      setFilteredReports(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports.");
      // Fallback data
      const fallbackData = [
        {
          _id: "report001",
          productId: "product001",
          productTitle: "Used Dell Inspiron 15 Laptop",
          sellerName: "Nusrat Jahan",
          reportedByEmail: "rakib@gmail.com",
          reason: "Misleading Description",
          reportDetails: "The product condition was not as described. Claimed 'Good' but has visible damage.",
          status: "pending",
          createdAt: new Date("2026-06-20"),
        },
        {
          _id: "report002",
          productId: "product002",
          productTitle: "iPhone 12, 128GB, Blue",
          sellerName: "Dev Jhon",
          reportedByEmail: "tanvir@gmail.com",
          reason: "Fraudulent Listing",
          reportDetails: "This appears to be a scam. Seller asking for advance payment outside platform.",
          status: "pending",
          createdAt: new Date("2026-06-18"),
        },
        {
          _id: "report003",
          productId: "product003",
          productTitle: "Wooden Study Table with Chair",
          sellerName: "Sumi Khan",
          reportedByEmail: "anika@gmail.com",
          reason: "Counterfeit Product",
          reportDetails: "The product photos are stolen from another listing. Suspicious activity.",
          status: "resolved",
          createdAt: new Date("2026-06-15"),
        },
      ];
      setReports(fallbackData);
      setFilteredReports(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter reports based on search and status
  useEffect(() => {
    let filtered = reports;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((report) =>
        report.productTitle?.toLowerCase().includes(query) ||
        report.sellerName?.toLowerCase().includes(query) ||
        report.reportedByEmail?.toLowerCase().includes(query) ||
        report.reason?.toLowerCase().includes(query)
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }
    
    setFilteredReports(filtered);
  }, [searchQuery, statusFilter, reports]);

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update report");

      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
      );
      toast.success(`Report ${newStatus} successfully.`);
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
        const res = await fetch(`${API_BASE_URL}/api/products/${report.productId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete product");
        toast.success("Product removed from marketplace.");
        await updateReportStatus(report._id, "resolved");
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove product.");
        return;
      }
      return;
    }

    if (actionType === "dismiss" || actionType === "warn") {
      await updateReportStatus(report._id, "resolved");
      toast.success(`Action: ${actionType} applied successfully.`);
    }
  };

  // Theme classes
  const bgClass = isDark ? "bg-zinc-950" : "bg-gray-50";
  const textClass = isDark ? "text-zinc-100" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-zinc-400" : "text-gray-600";
  const textMutedClass = isDark ? "text-zinc-500" : "text-gray-500";
  const borderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const cardBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
  const cardBorderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const detailBgClass = isDark ? "bg-zinc-950/50" : "bg-gray-100/50";
  const detailBorderClass = isDark ? "border-zinc-800/60" : "border-gray-200/60";
  const hoverBgClass = isDark ? "hover:bg-zinc-800/10" : "hover:bg-gray-100/50";
  const inputBgClass = isDark ? "bg-zinc-900/60" : "bg-white/60";
  const inputBorderClass = isDark ? "border-zinc-800" : "border-gray-200";

  // Stats
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;

  if (isLoading) {
    return (
      <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 flex items-center justify-center transition-colors duration-300`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 sm:size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${textMutedClass}`}>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 transition-colors duration-300`}>
      
      {/* Header */}
      <div className="mb-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${textClass}`}>
              Reported Products Review Panel
            </h1>
            <p className={`text-xs sm:text-sm ${textSecondaryClass} mt-1`}>
              Review community reports, warn sellers, dismiss complaints, or remove listings.
            </p>
          </div>
          <button
            onClick={fetchReports}
            disabled={isLoading}
            className={`p-2 rounded-lg border transition-all disabled:opacity-50 w-fit ${cardBgClass} ${borderClass} ${textSecondaryClass} hover:${textClass}`}
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4">
          <div className={`rounded-xl p-3 sm:p-4 border transition-colors ${cardBgClass} ${borderClass}`}>
            <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${textMutedClass}`}>Total</p>
            <p className={`text-lg sm:text-2xl font-bold ${textClass}`}>{totalReports}</p>
          </div>
          <div className={`rounded-xl p-3 sm:p-4 border transition-colors ${cardBgClass} ${borderClass}`}>
            <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${textMutedClass}`}>Pending</p>
            <p className="text-lg sm:text-2xl font-bold text-amber-400">{pendingReports}</p>
          </div>
          <div className={`rounded-xl p-3 sm:p-4 border transition-colors ${cardBgClass} ${borderClass}`}>
            <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${textMutedClass}`}>Resolved</p>
            <p className="text-lg sm:text-2xl font-bold text-emerald-400">{resolvedReports}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textMutedClass}`} />
          <input
            type="text"
            placeholder="Search by product, seller, reporter, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm transition-colors focus:outline-none focus:border-purple-500/50 border ${inputBgClass} ${inputBorderClass} ${textClass} placeholder:${textMutedClass}`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${textMutedClass} hover:${textClass}`}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-auto">
          <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textMutedClass}`} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full sm:w-auto rounded-xl pl-10 pr-8 py-2.5 text-sm transition-colors focus:outline-none focus:border-purple-500/50 appearance-none min-w-[130px] border ${inputBgClass} ${inputBorderClass} ${textClass}`}
          >
            <option value="all" className={isDark ? "bg-zinc-900" : "bg-white"}>All Status</option>
            <option value="pending" className={isDark ? "bg-zinc-900" : "bg-white"}>Pending</option>
            <option value="resolved" className={isDark ? "bg-zinc-900" : "bg-white"}>Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {filteredReports.length === 0 ? (
          <div className={`text-center py-12 ${textMutedClass} text-sm`}>
            {searchQuery || statusFilter !== "all" ? "No reports match your filters." : "No reported products at the moment."}
          </div>
        ) : (
          filteredReports.map((report) => (
            <div 
              key={report._id}
              className={`w-full ${cardBgClass} ${cardBorderClass} rounded-2xl p-4 sm:p-5 backdrop-blur-xs shadow-xl flex flex-col gap-4 transition-colors duration-300`}
            >
              {/* Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-950/40 text-red-400 border border-red-900/40 tracking-wider">
                    <AlertTriangle className="size-3 sm:size-3.5" />
                    REASON: {report.reason || "N/A"}
                  </span>
                  <span className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider border capitalize ${
                    report.status === "resolved"
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/40"
                      : "bg-amber-950/30 text-amber-400 border-amber-900/40"
                  }`}>
                    {report.status || "pending"}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] sm:text-xs ${textMutedClass} font-medium`}>
                  <Calendar className="size-3 sm:size-4 shrink-0" />
                  <span>
                    Reported on {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>

              {/* Product Title & Seller */}
              <div>
                <h2 className={`text-base sm:text-lg font-bold ${textClass} tracking-wide break-words`}>
                  Product: <span className={`font-semibold ${isDark ? "text-zinc-300" : "text-gray-700"}`}>
                    {report.productTitle || "N/A"}
                  </span>
                </h2>
                <p className={`text-[10px] sm:text-xs ${textMutedClass} mt-1`}>
                  Seller: <span className={`${isDark ? "text-zinc-400" : "text-gray-600"} font-medium`}>
                    {report.sellerName || "N/A"}
                  </span>
                </p>
              </div>

              {/* Report Details Box */}
              <div className={`w-full p-3 sm:p-4 rounded-xl ${detailBgClass} ${detailBorderClass} text-xs sm:text-sm`}>
                <span className={`${textMutedClass} font-medium`}>Report Details: </span>
                <span className={`${isDark ? "text-zinc-300" : "text-gray-700"} font-normal break-words`}>
                  {report.reportDetails || "No details provided."}
                </span>
              </div>

              {/* Bottom Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-zinc-800/30">
                {/* Reported By */}
                <div className={`flex items-center gap-2 text-[10px] sm:text-xs ${textMutedClass} font-medium min-w-0`}>
                  <User className={`size-3 sm:size-4 ${isDark ? "text-zinc-600" : "text-gray-400"} shrink-0`} />
                  <span className="truncate">
                    Reported by: <span className={`${isDark ? "text-zinc-400" : "text-gray-600"} font-semibold`}>
                      {report.reportedByEmail || "N/A"}
                    </span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {/* Inspect */}
                  <button
                    onClick={() => handleAction("inspect", report)}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold ${cardBgClass} border ${cardBorderClass} ${textSecondaryClass} ${hoverBgClass} transition-all cursor-pointer`}
                  >
                    <Eye className={`size-3 sm:size-4 ${textMutedClass}`} />
                    <span className="hidden xs:inline">Inspect</span>
                    <span className="xs:hidden">View</span>
                  </button>

                  {/* Dismiss */}
                  <button
                    onClick={() => handleAction("dismiss", report)}
                    disabled={report.status === "resolved"}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer ${
                      report.status === "resolved" 
                        ? "opacity-40 cursor-not-allowed hover:bg-emerald-950/20 hover:text-emerald-400" 
                        : ""
                    }`}
                  >
                    <CheckCircle2 className="size-3 sm:size-4" />
                    <span className="hidden xs:inline">Dismiss</span>
                    <span className="xs:hidden">✓</span>
                  </button>

                  {/* Warn Seller */}
                  <button
                    onClick={() => handleAction("warn", report)}
                    disabled={report.status === "resolved"}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-amber-950/20 border border-amber-900/30 text-amber-500 hover:bg-amber-600 hover:text-white transition-all cursor-pointer ${
                      report.status === "resolved" 
                        ? "opacity-40 cursor-not-allowed hover:bg-amber-950/20 hover:text-amber-500" 
                        : ""
                    }`}
                  >
                    <UserX className="size-3 sm:size-4" />
                    <span className="hidden md:inline">Warn Seller</span>
                    <span className="md:hidden">Warn</span>
                  </button>

                  {/* Remove Product */}
                  <button
                    onClick={() => handleAction("remove", report)}
                    disabled={report.status === "resolved"}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer ${
                      report.status === "resolved" 
                        ? "opacity-40 cursor-not-allowed hover:bg-red-950/30 hover:text-red-400" 
                        : ""
                    }`}
                  >
                    <Trash2 className="size-3 sm:size-4" />
                    <span className="hidden md:inline">Remove</span>
                    <span className="md:hidden">×</span>
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