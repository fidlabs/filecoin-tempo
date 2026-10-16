"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuarterContext } from "@/hooks/use-quarter-context";
import { fetchServiceOrchestratorQuarterlyVolume } from "@/lib/fpv-indexer";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import { cn, formatBigIntSpaced } from "@/lib/utils";

export type CalculatedQuarterlyVolumeProps = {
  serviceOrchestrator: string;
};

const useVolume = createFetcherHook(
  fetchServiceOrchestratorQuarterlyVolume,
  QueryKeys.SERVICE_ORCHESTRATOR_CALCULATED_QUARTERLY_VOLUME
);

const volumeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function CalculatedQuarterlyVolume({
  serviceOrchestrator,
}: CalculatedQuarterlyVolumeProps) {
  const { quarter } = useQuarterContext();
  const { data, error, isLoading } = useVolume({
    quarterNumber: quarter.q,
    serviceOrchestrator,
  });

  return (
    <Card>
      <CardHeader>
        <CardDescription>Calculated FPV(Q{quarter.q})</CardDescription>
        <CardTitle
          className={cn(
            "text-4xl tabular-nums",
            !isLoading && !!error && "text-destructive"
          )}
        >
          {isLoading && <Skeleton className="h-lh w-[100px]" />}
          {!isLoading && !!error && <span>Data fetch error</span>}
          {!isLoading && !error && (
            <span>
              {data
                ? (data.volumeAttoUsd > 0n ? "~" : "") +
                  volumeFormatter.format(data.volumeAttoUsd)
                : "-"}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {isLoading && <Skeleton className="h-lh w-[100px]" />}
          {!isLoading && !!error && <span className="text-destructive">-</span>}
          {!isLoading && !error && (
            <span>
              {data ? formatBigIntSpaced(data.volumeAttoUsd) + " attoUSD" : "-"}
            </span>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
