"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Recycle, ChevronDown, LayoutDashboard, User, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const SpinnerUI = () => (
  <div className="flex items-center gap-2 text-zinc-400 text-sm">
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
    Loading...
  </div>
);

const AvatarUI = ({ user, size = "sm" }) => {
  const dimension = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  return user?.image ? (
    <img
      src={user.image}
      alt={user.name}
      className={`${dimension} rounded-full border border-zinc-700 object-cover`}
    />
  ) : (
    <div className={`${dimension} rounded-full border border-zinc-700 bg-purple-600 flex items-center justify-center font-semibold text-white`}>
      {user?.name?.charAt(0)}
    </div>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const dashboardLinks = {
    buyer: "/dashboard/buyer",
    seller: "/dashboard/seller",
    admin: "/dashboard/admin",
  };

  const dashboardHref = dashboardLinks[user?.role] || "/dashboard/buyer";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Dashboard", href: dashboardHref },
  ];

  const isActive = (path) => pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      setIsProfileOpen(false);
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
              <Recycle className="h-6 w-6 text-purple-400" />
              <span>ReSell Hub</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-purple-400 ${
                  isActive(link.href) ? "text-purple-400 font-semibold" : "text-zinc-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isPending ? (
              <SpinnerUI />
            ) : user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
                >
                  <AvatarUI user={user} size="sm" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-zinc-200">{user.name}</span>
                    <span className={`text-[10px] font-medium capitalize ${
                      user?.role === "admin" ? "text-amber-400" :
                      user?.role === "seller" ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-400 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-sm font-medium text-zinc-100">{user.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={dashboardHref}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={`${dashboardHref}/profile`}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Profile Settings
                        </Link>
                      </div>
                      <div className="py-1 border-t border-zinc-800">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-900 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors hover:text-purple-400 ${
                    isActive("/login") ? "text-purple-400 font-semibold" : "text-zinc-400"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {isPending ? (
              <svg className="animate-spin h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : user ? (
              <AvatarUI user={user} size="md" />
            ) : null}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none p-1 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#09090b] border-b border-zinc-800"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.href) ? "bg-zinc-800 text-purple-400" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <hr className="border-zinc-800 my-2" />

              {isPending ? (
                <div className="flex justify-center py-3">
                  <SpinnerUI />
                </div>
              ) : user ? (
                <div className="space-y-3 pt-2 px-3">
                  {/* User Info Card */}
                  <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60">
                    <AvatarUI user={user} size="md" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-zinc-200 truncate">{user.name}</span>
                      <span className="text-xs text-zinc-500 truncate">{user.email}</span>
                      <span className={`text-[10px] font-medium capitalize ${
                        user?.role === "admin" ? "text-amber-400" :
                        user?.role === "seller" ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsOpen(false)}
                    className="block px-0 py-2 text-sm font-medium text-zinc-300 hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`${dashboardHref}/profile`}
                    onClick={() => setIsOpen(false)}
                    className="block px-0 py-2 text-sm font-medium text-zinc-300 hover:text-white"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-0 py-2 text-sm font-medium text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 px-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className={`block w-full text-center py-2 font-medium transition-colors hover:text-white ${
                      isActive("/login") ? "text-purple-400" : "text-zinc-400"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-md font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}