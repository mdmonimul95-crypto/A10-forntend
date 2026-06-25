"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Recycle, ChevronDown, LayoutDashboard, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef(null);

  // TODO (Phase 2): replace this mock state with real Better Auth session,
  // e.g. const { user, isLoggedIn, logout } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = {
    name: "Rakib Hasan",
    photo: "https://i.pravatar.cc/150?img=1",
    role: "buyer",
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const isActive = (path) => pathname === path;

  // close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // TODO (Phase 2): replace with real logout call (Better Auth signOut)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
              <Recycle className="h-6 w-6 text-purple-400" />
              <span>ReSell Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
                >
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-zinc-700 object-cover"
                  />
                  <span className="text-sm font-medium text-zinc-200">{user.name}</span>
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
                        <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
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
                  className="text-sm font-medium text-zinc-400 hover:text-white px-3 py-2 transition-colors"
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

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Options */}
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

              {isLoggedIn ? (
                <div className="space-y-1 pt-2 px-3">
                  <div className="flex items-center gap-3 pb-3">
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="h-9 w-9 rounded-full border border-zinc-700 object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-100">{user.name}</p>
                      <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-0 py-2 text-sm font-medium text-zinc-300 hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-0 py-2 text-sm font-medium text-zinc-300 hover:text-white"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-0 py-2 text-sm font-medium text-red-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 px-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center text-zinc-400 hover:text-white py-2 font-medium"
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