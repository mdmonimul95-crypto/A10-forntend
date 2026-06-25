"use client";

import React, { useState, useMemo } from "react";
import { Trash2, Calendar, Search, Ban, CheckCircle2 } from "lucide-react";
import { Avatar } from "@heroui/react";
import { toast } from "sonner";

const initialUsers = [
  {
    id: "user001",
    name: "Md. Rakib Hasan",
    email: "rakib.hasan@gmail.com",
    image: "https://i.pravatar.cc/300?img=1",
    role: "buyer",
    status: "active",
    registeredDate: "20/06/2026",
  },
  {
    id: "user002",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@gmail.com",
    image: "https://i.pravatar.cc/300?img=2",
    role: "seller",
    status: "active",
    registeredDate: "20/06/2026",
  },
  {
    id: "user003",
    name: "Tanvir Ahmed",
    email: "tanvir.ahmed@gmail.com",
    image: "",
    role: "buyer",
    status: "blocked",
    registeredDate: "19/06/2026",
  },
];

export default function AllUsersAdminPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");

  // Search filtering (client-side for now — will move to API query in Phase 8)
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully.`);
  };

  const handleDeleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.warning(`User ID: ${userId} deleted.`);
  };

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">
      {/* Header Title Section */}
      <div className="mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          User Accounts Management
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Search users, monitor status, and manage accounts across ReSell Hub.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto overflow-hidden bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-xs shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/*  Heading */}
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900/20">
                <th className="py-4 px-6">Profile Details</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6 text-center">Role</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6">Registered Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-6 text-center text-zinc-500 text-sm">
                    No users match your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-zinc-800/20"
                  >
                    {/* img name*/}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-zinc-700/50 shadow-xs shrink-0">
                          <Avatar.Image alt={user.name} src={user.image} />
                          <Avatar.Fallback className="bg-purple-500/10 text-purple-400 font-semibold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar.Fallback>
                        </Avatar>
                        <span className="font-semibold text-zinc-200 tracking-wide">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                      {user.email}
                    </td>

                    {/* Role Badge (read-only) */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider bg-purple-950/40 text-purple-400 border-purple-900/50">
                        {user.role}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${
                        user.status === "active"
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                          : "bg-red-950/40 text-red-400 border-red-900/50"
                      }`}>
                        {user.status}
                      </span>
                    </td>

                    {/*  Date */}
                    <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-4 text-zinc-600" />
                        <span>{user.registeredDate}</span>
                      </div>
                    </td>

                    {/*  Buttons */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* Block / Unblock */}
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`p-2 rounded-xl border transition-all shadow-xs ${
                            user.status === "active"
                              ? "bg-amber-950/20 text-amber-400 border-amber-900/40 hover:bg-amber-500 hover:text-white"
                              : "bg-emerald-950/20 text-emerald-400 border-emerald-900/40 hover:bg-emerald-500 hover:text-white"
                          }`}
                          title={user.status === "active" ? "Block User" : "Unblock User"}
                        >
                          {user.status === "active" ? (
                            <Ban className="size-4" />
                          ) : (
                            <CheckCircle2 className="size-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-xl bg-red-950/20 text-red-400 border border-red-900/40 hover:bg-red-500 hover:text-white transition-all shadow-xs"
                          title="Delete User"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}