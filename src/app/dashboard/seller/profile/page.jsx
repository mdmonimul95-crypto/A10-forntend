"use client";

import React, { useState, useEffect } from "react";
import { Camera, Mail, Save, User, MapPin, Phone, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

export default function SellerProfileSettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    image: "",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const themeStyles = {
    bg: isDark ? "bg-zinc-950" : "bg-gray-50",
    text: isDark ? "text-zinc-100" : "text-gray-900",
    textSecondary: isDark ? "text-zinc-400" : "text-gray-500",
    textMuted: isDark ? "text-zinc-500" : "text-gray-400",
    border: isDark ? "border-zinc-800" : "border-gray-200",
    cardBg: isDark ? "bg-zinc-900/50" : "bg-white",
    cardBorder: isDark ? "border-zinc-800" : "border-gray-200",
    inputBg: isDark ? "bg-zinc-950/60" : "bg-gray-50/60",
    inputBorder: isDark ? "border-zinc-800" : "border-gray-200",
    inputText: isDark ? "text-zinc-200" : "text-gray-800",
    inputPlaceholder: isDark ? "placeholder-zinc-600" : "placeholder-gray-400",
    label: isDark ? "text-zinc-400" : "text-gray-600",
    disabledBg: isDark ? "bg-zinc-950/30" : "bg-gray-100/30",
    disabledText: isDark ? "text-zinc-500" : "text-gray-500",
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      return toast.error("Name is required.");
    }

    setIsSubmitting(true);

    try {
      await authClient.updateUser({
        name: formData.name,
        image: formData.image,
      });

      const res = await fetch(
        `${API_BASE_URL}/api/users/${user?.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            location: formData.location,
            bio: formData.bio,
            image: formData.image,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className={`w-full min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 sm:size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${themeStyles.textSecondary}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className={`w-full min-h-screen ${themeStyles.bg} ${themeStyles.text} p-4 sm:p-6 transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profile Settings</h1>
          <p className={`text-sm ${themeStyles.textSecondary} mt-1`}>
            Update your seller account information
          </p>
        </div>

        {/* Profile Summary Card - Responsive */}
        <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 shadow-sm`}>
          <div className="relative shrink-0">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl overflow-hidden shadow-lg shadow-purple-500/20">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                  onError={(e) => e.target.classList.add("hidden")}
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "S"
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-zinc-800 border-2 border-zinc-700 text-zinc-300">
              <Camera className="size-3.5" />
            </div>
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">{user?.name || "Seller"}</h2>
            <p className={`text-sm ${themeStyles.textSecondary} truncate`}>{user?.email}</p>
            <p className={`text-xs ${themeStyles.textMuted} mt-0.5 flex flex-wrap items-center justify-center sm:justify-start gap-1`}>
              <span className="text-emerald-400 font-medium capitalize">{user?.role || "Seller"}</span>
              <span className="hidden sm:inline">•</span>
              <span>Member since {memberSince}</span>
            </p>
          </div>
        </div>

        {/* Form - Responsive */}
        <form
          onSubmit={handleSubmit}
          className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 shadow-sm`}
        >
          <h3 className={`text-xs font-bold uppercase tracking-wider ${themeStyles.textSecondary}`}>
            Personal Information
          </h3>

          {/* Name & Email - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className={`text-xs font-semibold ${themeStyles.label}`}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${themeStyles.textMuted}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-xs font-semibold ${themeStyles.label}`}>
                <Mail className="size-3.5 inline mr-1" /> Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${themeStyles.textMuted}`} />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className={`w-full ${themeStyles.disabledBg} ${themeStyles.inputBorder} ${themeStyles.disabledText} rounded-xl pl-10 pr-4 py-2.5 cursor-not-allowed text-sm`}
                />
              </div>
            </div>
          </div>

          {/* Phone & Location - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className={`text-xs font-semibold ${themeStyles.label}`}>
                <Phone className="size-3.5 inline mr-1" /> Phone
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${themeStyles.textMuted}`} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXX-XXXXXX"
                  className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-xs font-semibold ${themeStyles.label}`}>
                <MapPin className="size-3.5 inline mr-1" /> Location
              </label>
              <div className="relative">
                <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${themeStyles.textMuted}`} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Dhaka, Bangladesh"
                  className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
                />
              </div>
            </div>
          </div>

          {/* Photo URL - Full Width */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-semibold ${themeStyles.label}`}>
              Photo URL <span className={`text-xs font-normal ${themeStyles.textMuted}`}>(Optional)</span>
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
            />
          </div>

          {/* Bio - Full Width */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-semibold ${themeStyles.label}`}>
              <FileText className="size-3.5 inline mr-1" /> Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell buyers a little about yourself as a seller..."
              className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none text-sm`}
            />
            <p className={`text-xs ${themeStyles.textMuted} text-right`}>
              {formData.bio.length}/500
            </p>
          </div>

          {/* Submit Button - Responsive */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}