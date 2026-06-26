"use client";

import { Button, Drawer } from "@heroui/react";
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
  ShieldCheck,
  PlusCircle,
  Menu,
} from "lucide-react";

export function DashboardSidebar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();

  const adminNavLinks = [
    { icon: LayoutDashboard, href: "/dashboard/admin", label: "Overview" },
    { icon: Users, href: "/dashboard/admin/manage-users", label: "Manage Users" },
    { icon: Package, href: "/dashboard/admin/manage-products", label: "Manage Products" },
    { icon: ListOrdered, href: "/dashboard/admin/manage-orders", label: "Manage Orders" },
    { icon: CreditCard, href: "/dashboard/admin/payments", label: "All Payments" },
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
    { icon: LayoutDashboard, href: "/dashboard/buyer", label: "Overview" },
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

  // isPending এর সময় skeleton দেখাবে
  if (isPending) {
    return (
      <aside className="hidden w-64 shrink-0 border-r border-zinc-800 p-4 lg:block">
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-xl bg-zinc-800/50 animate-pulse"
            />
          ))}
        </div>
      </aside>
    );
  }

  const navItems = navLinksMap[user?.role] || buyerNavLinks;

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
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
      <aside className="hidden w-64 shrink-0 border-r border-zinc-800 p-4 lg:block">
        {/* User Info */}
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

        {navContent}
      </aside>

      {/* Mobile Drawer */}
      <Drawer>
        <Button className="lg:hidden fixed bottom-4 left-4 z-50" variant="secondary">
          <Menu className="size-4" />
          Menu
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                {navContent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}