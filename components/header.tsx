import Link from "next/link";

import { Container } from "@/components/container";
import { FilecoinMark } from "@/components/filecoin-mark";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { ReactNode } from "react";

export type HeaderProps = {
  extras?: ReactNode[];
};

export function Header({ extras }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          aria-label="Filecoin Dashboards home"
          className="flex shrink-0 items-center gap-2.5 text-foreground"
          href="/"
        >
          <div className="relative">
            <FilecoinMark className="size-10" />
          </div>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            <span className="text-muted-foreground">Filecoin </span>
            Tempo
          </span>
        </Link>

        <MainNav />

        <div className="flex items-center gap-2">
          {extras}
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
