"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { labelForSegment } from "./nav-config";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    return { href, label: labelForSegment(segment), isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="px-4 pt-4 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
        <li>
          <Link href="/dashboard" className="hover:text-ink-900">
            Home
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-ink-300" />
            {crumb.isLast ? (
              <span aria-current="page" className="font-medium text-ink-900">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="hover:text-ink-900">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}