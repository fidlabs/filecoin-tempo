"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [{ label: "Orchestrators", href: "/service-orchestrators" }];

export function MainNav() {
  const pathname = usePathname();

  if (navigation.length < 2) {
    return null;
  }

  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 md:flex"
    >
      {navigation.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm"
                : "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            }
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
