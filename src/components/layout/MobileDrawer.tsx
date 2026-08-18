"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closeMobileNav } from "@/lib/redux/slices/uiSlice";
import SidebarContent from "./SidebarContent";

export default function MobileDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.mobileNavOpen);
  const role = useAppSelector((state) => state.auth.user?.role);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !role || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div
        className="absolute inset-0 bg-ink-950/50"
        aria-hidden="true"
        onClick={() => dispatch(closeMobileNav())}
      />
      <div className="relative flex h-full w-72 max-w-[80vw] flex-col">
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => dispatch(closeMobileNav())}
          className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-ink-300 hover:bg-ink-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent
          role={role}
          collapsed={false}
          onNavigate={() => dispatch(closeMobileNav())}
        />
      </div>
    </div>,
    document.body,
  );
}