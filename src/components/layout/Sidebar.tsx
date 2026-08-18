"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils/cn";
import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const role = useAppSelector((state) => state.auth.user?.role);

  if (!role) return null;

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-ink-800 transition-[width] duration-200 md:block",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="sticky top-0 h-screen">
        <SidebarContent role={role} collapsed={collapsed} />
      </div>
    </aside>
  );
}