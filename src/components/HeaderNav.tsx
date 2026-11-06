"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/config/site";

function isCurrent(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav({ actions }: { actions: ReactNode }) {
  const pathname = usePathname();
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  // بيتقفل لوحده عند الانتقال لصفحة تانية لأن الحالة مربوطة بالمسار
  const open = openOnPath === pathname;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOnPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {navLinks.map((link) => {
            const current = isCurrent(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-full px-4 py-2 font-medium transition-colors hover:bg-sand ${
                    current ? "bg-sand font-bold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden items-center gap-2 lg:flex">{actions}</div>

      <button
        type="button"
        onClick={() => setOpenOnPath(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "اقفل القائمة" : "افتح القائمة"}
        className="inline-flex size-12 items-center justify-center rounded-full border-2 border-navy/20 lg:hidden"
      >
        {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
      </button>

      {open ? (
        <nav
          id="mobile-menu"
          aria-label="قائمة الموبايل"
          className="absolute inset-x-0 top-full z-40 border-b border-navy/10 bg-cream px-4 pb-6 shadow-lg lg:hidden"
        >
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-navy/10">
                <Link
                  href={link.href}
                  aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                  className="block py-3.5 text-lg font-medium aria-[current=page]:font-bold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
