"use client";

import {
  Bell,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleMobileNav, toggleSidebar } from "@/lib/redux/slices/uiSlice";
import UserMenu from "./UserMenu";

export default function Topbar() {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-100 bg-white px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => dispatch(toggleMobileNav())}
        className="rounded-lg p-2 text-ink-700 hover:bg-ink-100 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => dispatch(toggleSidebar())}
        className="hidden rounded-lg p-2 text-ink-700 hover:bg-ink-100 md:inline-flex"
      >
        {collapsed ? (
          <PanelLeftOpen className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
        <input
          type="search"
          placeholder="Search products, orders, customers…"
          className="h-10 w-full rounded-lg border border-ink-200 bg-ink-50 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-ink-700 hover:bg-ink-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}