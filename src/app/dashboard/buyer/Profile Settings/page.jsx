"use client";

import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react";
import { Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function BuyerProfileSettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    image: user?.image || "",
  });

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
      // TODO: call your API to update user profile
      // await fetch("/api/user/update", { method: "PATCH", body: JSON.stringify(formData) })

      await authClient.updateUser({
        name: formData.name,
        image: formData.image,
      });

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-sm font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <User className="size-6 text-purple-400" />
            Profile Settings
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Update your personal information and profile photo.
          </p>
        </div>

        {/* Profile Card */}
        <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 shadow-xl">

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3 pb-6 border-b border-zinc-800/60 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md"></div>
              <Avatar className="h-24 w-24 border-2 border-purple-500/50 relative z-10">
                <Avatar.Image
                  alt="Profile"
                  src={formData.image || user?.image}
                />
                <Avatar.Fallback className="bg-purple-500/10 text-purple-400 font-bold text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || "B"}
                </Avatar.Fallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 z-20 p-1.5 rounded-full bg-purple-600 border-2 border-zinc-950">
                <Camera className="size-3.5 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-zinc-100">{user?.name}</p>
              <p className="text-xs text-zinc-500">{user?.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider mt-1 bg-rose-950/30 border-rose-900/50 text-rose-400">
                {user?.role || "buyer"}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <User className="size-3.5" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Md. Rakib Hasan"
                required
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Email — read only */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Mail className="size-3.5" />
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-zinc-900/30 border border-zinc-800/50 text-zinc-500 rounded-xl px-4 py-3 cursor-not-allowed"
              />
              <p className="text-[11px] text-zinc-600">Email cannot be changed.</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Phone className="size-3.5" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+8801712345678"
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Dhaka, Bangladesh"
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Photo URL */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Camera className="size-3.5" />
                Photo URL <span className="text-zinc-600 font-normal normal-case">(Optional)</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <p className="text-[11px] text-zinc-600">
                Direct image link ending with .jpg, .png, .webp etc.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all active:scale-[0.99] shadow-md shadow-purple-900/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="size-4" />
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}