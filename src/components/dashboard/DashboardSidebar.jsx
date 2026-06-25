"use client";

import {
  Person,
  ChartLineArrowUp,
  Persons,
  CirclePlusFill,
  StarFill,
  CreditCard,
  BookOpen,
  FloppyDisk,
  LayoutSideContentLeft,
  ListCheck,
  Heart,
  ShoppingCart,
  ArrowUpRightFromSquare,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function DashboardSidebar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const adminNavLinks = [
    { icon: Person, href: "/dashboard/admin", label: "Overview" },
    { icon: Persons, href: "/dashboard/admin/manage-users", label: "Manage Users" },
    { icon: BookOpen, href: "/dashboard/admin/manage-products", label: "Manage Products" },
    { icon: ListCheck, href: "/dashboard/admin/manage-orders", label: "Manage Orders" },
    { icon: CreditCard, href: "/dashboard/admin/payments", label: "All Payments" },
    { icon: ChartLineArrowUp, href: "/dashboard/admin/analytics", label: "Platform Analytics" },
  ];

  const sellerNavLinks = [
    { icon: Person, href: "/dashboard/seller", label: "Overview" },
    { icon: CirclePlusFill, href: "/dashboard/seller/add-product", label: "Add Product" },
    { icon: BookOpen, href: "/dashboard/seller/my-products", label: "My Products" },
    { icon: ListCheck, href: "/dashboard/seller/manage-orders", label: "Manage Orders" },
    { icon: ChartLineArrowUp, href: "/dashboard/seller/analytics", label: "Sales Analytics" },
    { icon: Person, href: "/dashboard/seller/profile", label: "Profile Settings" },
  ];

  const buyerNavLinks = [
    { icon: Person, href: "/dashboard/buyer", label: "Overview" },
    { icon: ShoppingCart, href: "/dashboard/buyer/my-orders", label: "My Orders" },
    { icon: Heart, href: "/dashboard/buyer/wishlist", label: "Wishlist" },
    { icon: CreditCard, href: "/dashboard/buyer/payment-history", label: "Payment History" },
    { icon: Person, href: "/dashboard/buyer/profile", label: "Profile Settings" },
  ];

  const navLinksMap = {
    buyer: buyerNavLinks,
    seller: sellerNavLinks,
    admin: adminNavLinks,
  };

  const navItems = navLinksMap[user?.role || "buyer"];

  const navContent = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.label}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
          href={item.href}
        >
          <item.icon className="size-5 text-muted" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      <Drawer>
        <Button className="lg:hidden" variant="secondary">
          <LayoutSideContentLeft />
          Sidebar
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