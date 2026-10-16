"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchServiceOrchestratorQuarterlyVolume } from "@/lib/fpv-indexer";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import { cn } from "cn";
import { HTMLAttributes } from "react";

export type ServiceOrchestratorCalculatedQuarterlyVolumeProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  quarterNumber: number | `Q${number}`;
  serviceOrchestrator: string;
};

const volumeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const useVolume = createFetcherHook(
  fetchServiceOrchestratorQuarterlyVolume,
  QueryKeys.SERVICE_ORCHESTRATOR_CALCULATED_QUARTERLY_VOLUME
);

export function ServiceOrchestratorCalculatedQuarterlyVolume({
  className,
  quarterNumber,
  serviceOrchestrator,
  ...rest
}: ServiceOrchestratorCalculatedQuarterlyVolumeProps) {
  const { data, error, isLoading } = useVolume({
    quarterNumber,
    serviceOrchestrator,
  });

  if (isLoading) {
    return (
      <span {...rest} className={className}>
        <Skeleton className="h-lh w-[60px]" />
      </span>
    );
  }

  if (!!error) {
    return (
      <span {...rest} className={cn("text-destructive", className)}>
        Error loading
      </span>
    );
  }

  return (
    <span {...rest} className={cn("tabular-nums", className)}>
      {data ? volumeFormatter.format(data.volumeUsd) : "N/A"}
    </span>
  );
}
