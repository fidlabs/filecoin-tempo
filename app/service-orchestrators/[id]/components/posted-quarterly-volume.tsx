"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuarterContext } from "@/hooks/use-quarter-context";
import { fetchServiceOrchestratorQuarterlyVolumePosting } from "@/lib/fpv-indexer";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import { cn, divideBigInt, formatBigIntSpaced } from "@/lib/utils";

type PostingState = "corrected" | "missed" | "posted" | "not_posted";

export type PostedQuarterlyVolumeProps = {
  serviceOrchestrator: string;
};

const useVolumePosting = createFetcherHook(
  fetchServiceOrchestratorQuarterlyVolumePosting,
  QueryKeys.SERVICE_ORCHESTRATOR_QUARTERLY_VOLUME_POSTING
);

const volumeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function PostedQuarterlyVolume({
  serviceOrchestrator,
}: PostedQuarterlyVolumeProps) {
  const { quarter } = useQuarterContext();
  const { data, error, isLoading } = useVolumePosting({
    quarterNumber: quarter.q,
    serviceOrchestrator,
  });

  const postingState: PostingState | null = (() => {
    if (isLoading || !!error || !data) {
      return null;
    }

    if (data.corrected) {
      return "corrected";
    }

    if (data.missed) {
      return "missed";
    }

    return data.volumeAttoUsd !== null ? "posted" : "not_posted";
  })();

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center justify-between gap-2">
          <span>Posted FPV(Q{quarter.q})</span>
          {postingState ? (
            <Badge variant="outline">
              <span
                className={cn(
                  "size-2 rounded-full",
                  postingState === "corrected" && "bg-yellow-500",
                  postingState === "missed" && "bg-red-500",
                  postingState === "posted" && "bg-green-500",
                  postingState === "not_posted" && "bg-gray-500/50"
                )}
              />
              {postingState === "corrected" && "Corrected"}
              {postingState === "missed" && "Missed"}
              {postingState === "posted" && "Posted"}
              {postingState === "not_posted" && "Not Posted"}
            </Badge>
          ) : (
            <Skeleton className="h-5 w-[70px]" />
          )}
        </CardDescription>
        <CardTitle className="text-4xl tabular-nums">
          {isLoading && <Skeleton className="h-lh w-[100px]" />}
          {!isLoading && !!error && (
            <span className="text-destructive">Data fetch error</span>
          )}
          {!isLoading && !error && (
            <span>
              {data?.volumeAttoUsd
                ? (data.volumeAttoUsd > 0n ? "~" : "") +
                  volumeFormatter.format(
                    divideBigInt(data.volumeAttoUsd, 10n ** 18n, 2)
                  )
                : "N/A"}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {isLoading && <Skeleton className="h-lh w-[100px]" />}
          {!isLoading && !!error && <span className="text-destructive">-</span>}
          {!isLoading && !error && (
            <span>
              {data?.volumeAttoUsd
                ? formatBigIntSpaced(data.volumeAttoUsd) + " attoUSD"
                : "-"}
            </span>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
