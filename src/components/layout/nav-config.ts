import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  ShieldCheck,
  FileBarChart,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { UserRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "staff"],
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
    roles: ["admin", "staff"],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Boxes,
    roles: ["admin", "staff"],
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    roles: ["admin", "staff"],
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
    roles: ["admin", "staff"],
  },
  {
    label: "Staff",
    href: "/staff",
    icon: ShieldCheck,
    roles: ["admin"],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileBarChart,
    roles: ["admin", "staff"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "staff"],
  },
];

export function navItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function labelForSegment(segment: string): string {
  const match = NAV_ITEMS.find((item) => item.href === `/${segment}`);
  if (match) return match.label;
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}