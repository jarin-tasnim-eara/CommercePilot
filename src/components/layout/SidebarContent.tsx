"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { navItemsForRole } from "./nav-config";
import { UserRole } from "@/types";

interface SidebarContentProps {
  role: UserRole;
  collapsed: boolean;
  onNavigate?: () => void;
}

export default function SidebarContent({
  role,
  collapsed,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const items = navItemsForRole(role);

  return (
    <div className="flex h-full flex-col bg-ink-900 text-ink-100">
      <div
        className={cn(
          "flex h-16 items-center gap-2 px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500">
          <Rocket className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide text-white">
            CommercePilot
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-brand-500 text-white"
                  : "text-ink-300 hover:bg-ink-800 hover:text-white",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="border-t border-ink-800 px-4 py-3 text-xs text-ink-500">
          CommercePilot v0.1
        </div>
      )}
    </div>
  );
}