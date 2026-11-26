"use client";

import { cn } from "@/lib/utils";
import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FilecoinMark } from "./filecoin-mark";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Storage Providers", href: "/storage-providers" },
  { label: "Service Orchestrators", href: "/service-orchestrators" },
];

export function TabNavigation() {
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
                ? "rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground shadow-sm"
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

type SheetNaviagtionProps = {
  extras?: ReactNode[] | undefined;
};

export function SheetNaviagtion({ extras }: SheetNaviagtionProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (navigation.length < 2) {
    return null;
  }

  return (
    <Sheet open={open}>
      <Button
        aria-label="Open side menu"
        className="md:hidden"
        size="icon"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <PanelRightOpenIcon />
      </Button>
      <SheetContent className="w-full!" showCloseButton={false}>
        <div className="flex items-center justify-between p-6">
          <div className="flex shrink-0 items-center gap-2.5 text-foreground">
            <div className="relative">
              <FilecoinMark className="size-10" />
            </div>
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              <span className="text-muted-foreground">Filecoin </span>
              Tempo
            </span>
          </div>

          <Button
            aria-label="Close side menu"
            size="icon"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            <PanelRightCloseIcon />
          </Button>
        </div>
        <nav aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block text-lg",
                  isActive
                    ? "bg-secondary px-3 py-2 font-medium text-secondary-foreground shadow-sm"
                    : "px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {!!extras && extras.length > 0 && (
          <div className="mt-auto flex flex-col gap-2 p-6">{extras}</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
