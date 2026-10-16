import { Container } from "@/components/container";
import { FilecoinMark } from "@/components/filecoin-mark";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingOrb() {
  return (
    <div className="relative flex size-20 items-center justify-center">
      <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
      <div className="absolute inset-2 animate-pulse rounded-full border border-primary/30 bg-primary/10" />
      <FilecoinMark className="relative size-10 shadow-lg shadow-primary/25" />
    </div>
  );
}

export default function Loading() {
  return (
    <div
      aria-label="Loading Filecoin dashboard"
      aria-live="polite"
      className="min-h-svh"
      role="status"
    >
      <Header />
      <main>
        <Container className="flex flex-col gap-10 py-16">
          <div className="flex flex-col items-center gap-5 py-8 text-center">
            <LoadingOrb />
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-primary">Loading...</p>
              <p className="text-sm text-muted-foreground">
                Preparing your dashboard
              </p>
            </div>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
              <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                className="flex flex-col gap-5 rounded-xl border border-border/70 bg-card p-5 shadow-sm"
                key={index}
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="size-8 rounded-full" />
                </div>
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex min-h-72 flex-col gap-6 rounded-xl border border-border/70 bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-9 w-24" />
              </div>
              <div className="flex flex-1 items-end gap-3 pt-8">
                {[42, 64, 50, 78, 58, 88, 70, 94, 76, 100].map((height) => (
                  <Skeleton
                    className="flex-1 rounded-t-md rounded-b-none"
                    key={height}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex min-h-72 flex-col gap-6 rounded-xl border border-border/70 bg-card p-6 shadow-sm">
              <Skeleton className="h-5 w-36" />
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }, (_, index) => (
                  <div className="flex items-center gap-3" key={index}>
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
