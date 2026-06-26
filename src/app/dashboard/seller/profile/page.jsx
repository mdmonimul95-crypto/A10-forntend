"use client";

import React, { useState } from "react";
import { Camera, Mail } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SellerProfileSettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
  });

  // Sync form once session loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving profile updates:", formData);
    toast.success("Profile updated! Check console log.");
  };

  if (isPending) {
    return (
      <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">
        <p className="text-zinc-500 text-sm">Loading profile...</p>
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
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Profile Settings
          </h1>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4 mb-5">
          <div className="relative shrink-0">
            <div className="h-14 w-14 rounded-full bg-linear-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "S"
              )}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-colors"
              title="Change profile photo"
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">{user?.name || "Seller"}</h2>
            <p className="text-sm text-zinc-400">{user?.email}</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              <span className="text-purple-400 font-medium capitalize">{user?.role || "Seller"}</span>
              {" • "}Member since {memberSince}
            </p>
          </div>
        </div>

        {/* Personal Information Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-5 text-sm"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-400">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                <Mail className="size-3.5" /> Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-zinc-950/30 border border-zinc-800 text-zinc-500 rounded-xl px-4 py-2.5 cursor-not-allowed"
              />
              <span className="text-[11px] text-zinc-600">Email cannot be changed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-400">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1XXX-XXXXXX"
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-400">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Dhaka, Bangladesh"
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-400">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell buyers a little about yourself as a seller..."
              className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="self-start mt-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-600/20"
          >
            Save Changes
          </button>
        </form>

      </div>
    </div>
  );
}