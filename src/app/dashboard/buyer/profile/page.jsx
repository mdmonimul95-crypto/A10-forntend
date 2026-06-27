"use client";

import React, { useEffect, useState, useCallback } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, Loader2 } from "lucide-react";
import { Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function BuyerProfileSettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
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
    disabledBg: isDark ? "bg-zinc-900/30" : "bg-gray-100/30",
    disabledText: isDark ? "text-zinc-500" : "text-gray-500",
  };

  const fetchProfile = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users/${encodeURIComponent(user.email)}`
      );

      if (res.status === 404) {
        setFormData({
          name: user?.name || "",
          phone: "",
          location: "",
          image: user?.image || "",
        });
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch");

      const text = await res.text();
      if (!text) {
        setFormData({
          name: user?.name || "",
          phone: "",
          location: "",
          image: user?.image || "",
        });
        return;
      }

      const data = JSON.parse(text);
      setFormData({
        name: data?.name || user?.name || "",
        phone: data?.phone || "",
        location: data?.location || "",
        image: data?.image || user?.image || "",
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      setFormData({
        name: user?.name || "",
        phone: "",
        location: "",
        image: user?.image || "",
      });
    }
  }, [user?.email, user?.name, user?.image, API_BASE_URL]);

  useEffect(() => {
    if (!user?.email) return;
    fetchProfile();
  }, [user?.email, fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return toast.error("Name is required.");
    }

    setIsSubmitting(true);

    try {
      await authClient.updateUser({
        name: formData.name,
        image: formData.image,
      });

      const res = await fetch(
        `${API_BASE_URL}/api/users/profile/${encodeURIComponent(user.email)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            location: formData.location,
            image: formData.image,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Something went wrong.");
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

  return (
    <div className={`w-full min-h-screen ${themeStyles.bg} ${themeStyles.text} p-4 sm:p-6 transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <User className="size-5 sm:size-6 text-purple-400" />
            Profile Settings
          </h1>
          <p className={`text-sm ${themeStyles.textSecondary} mt-1`}>
            Update your personal information and profile photo.
          </p>
        </div>

        {/* Card */}
        <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl p-4 sm:p-6 shadow-sm transition-colors duration-300`}>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3 pb-6 border-b border-zinc-800/60 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md"></div>
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-purple-500/50 relative z-10">
                <Avatar.Image
                  src={formData.image || user?.image}
                  alt="Profile"
                />
                <Avatar.Fallback className="bg-purple-500/10 text-purple-400 text-xl sm:text-2xl font-bold">
                  {formData.name?.charAt(0)?.toUpperCase() || "B"}
                </Avatar.Fallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 z-20 p-1.5 rounded-full bg-purple-600 border-2 border-zinc-950">
                <Camera className="size-3.5 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className={`text-base font-bold ${themeStyles.text}`}>{formData.name || "Buyer"}</p>
              <p className={`text-xs ${themeStyles.textMuted}`}>{user?.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider mt-1 bg-rose-500/10 text-rose-400 border-rose-500/20">
                Buyer
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${themeStyles.label} flex items-center gap-1.5`}>
                <User className="size-3.5" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Md. Rakib Hasan"
                className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${themeStyles.label} flex items-center gap-1.5`}>
                <Mail className="size-3.5" />
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className={`w-full ${themeStyles.disabledBg} ${themeStyles.inputBorder} ${themeStyles.disabledText} rounded-xl px-4 py-3 cursor-not-allowed text-sm`}
              />
              <p className={`text-[11px] ${themeStyles.textMuted}`}>Email cannot be changed.</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${themeStyles.label} flex items-center gap-1.5`}>
                <Phone className="size-3.5" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+8801712345678"
                className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${themeStyles.label} flex items-center gap-1.5`}>
                <MapPin className="size-3.5" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Dhaka, Bangladesh"
                className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
              />
            </div>

            {/* Photo URL */}
            <div className="flex flex-col gap-2">
              <label className={`text-xs font-bold uppercase tracking-wider ${themeStyles.label} flex items-center gap-1.5`}>
                <Camera className="size-3.5" />
                Photo URL
                <span className={`text-xs font-normal ${themeStyles.textMuted}`}>(Optional)</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
              />
              <p className={`text-[11px] ${themeStyles.textMuted}`}>
                Direct image link ending with .jpg, .png, .webp etc.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-200 active:scale-[0.99] shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
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
    </div>
  );
}