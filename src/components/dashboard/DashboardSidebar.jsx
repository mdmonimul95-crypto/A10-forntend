"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Heart,
  CreditCard,
  User,
  ListOrdered,
  BarChart2,
  Users,
  Flag,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";

export function DashboardSidebar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const adminNavLinks = [
    { icon: LayoutDashboard, href: "/dashboard/admin", label: "Overview" },
    { icon: Users, href: "/dashboard/admin/all-user", label: "Manage Users" },
    { icon: Package, href: "/dashboard/admin/all-products", label: "Manage Products" },
    { icon: Flag, href: "/dashboard/admin/reported-products", label: "Reported Products" },
    { icon: ListOrdered, href: "/dashboard/admin/manage-orders", label: "Manage Orders" },
    { icon: CreditCard, href: "/dashboard/admin/all-payments", label: "All Payments" },
    { icon: BarChart2, href: "/dashboard/admin/analytics", label: "Platform Analytics" },
  ];

  const sellerNavLinks = [
    { icon: LayoutDashboard, href: "/dashboard/seller", label: "Overview" },
    { icon: PlusCircle, href: "/dashboard/seller/add-product", label: "Add Product" },
    { icon: Package, href: "/dashboard/seller/my-products", label: "My Products" },
    { icon: ListOrdered, href: "/dashboard/seller/orders", label: "Orders" },
    { icon: BarChart2, href: "/dashboard/seller/analytics", label: "Analytics" },
    { icon: User, href: "/dashboard/seller/profile", label: "Profile" },
  ];

  const buyerNavLinks = [
    { icon: LayoutDashboard, href: "/dashboard/buyer/overview", label: "Overview" },
    { icon: ShoppingCart, href: "/dashboard/buyer/my-orders", label: "My Orders" },
    { icon: Heart, href: "/dashboard/buyer/wishlist", label: "Wishlist" },
    { icon: CreditCard, href: "/dashboard/buyer/payment-history", label: "Payment History" },
    { icon: User, href: "/dashboard/buyer/profile", label: "Profile Settings" },
  ];

  const navLinksMap = {
    buyer: buyerNavLinks,
    seller: sellerNavLinks,
    admin: adminNavLinks,
  };

  if (isPending) {
    return (
      <>
        {/* Desktop Skeleton */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-zinc-800 p-4">
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-zinc-800/50 animate-pulse" />
            ))}
          </div>
        </aside>
        {/* Mobile Skeleton */}
        <div className="lg:hidden fixed top-[65px] left-4 z-50">
          <div className="h-10 w-24 rounded-xl bg-zinc-800/50 animate-pulse" />
        </div>
      </>
    );
  }

  const navItems = navLinksMap[user?.role] || buyerNavLinks;

  const userInfo = (
    <div className="mb-4 flex items-center gap-3 px-3 py-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-zinc-200 truncate">{user?.name}</span>
        <span className={`text-[10px] font-bold uppercase ${
          user?.role === "admin" ? "text-amber-400" :
          user?.role === "seller" ? "text-emerald-400" : "text-rose-400"
        }`}>
          {user?.role || "buyer"}
        </span>
      </div>
    </div>
  );

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-purple-600/20 text-purple-400 border border-purple-500/20"
                : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
            }`}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-zinc-800 p-4">
        {userInfo}
        {navContent}
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-[72px] left-4 z-50 flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-sm font-medium transition-all shadow-lg"
      >
        <Menu className="size-4" />
        Menu
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 z-50 p-4 flex flex-col gap-4 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>

        {/* Drawer Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-bold text-zinc-100">Navigation</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {userInfo}
        {navContent}
      </div>
    </>
  );
}