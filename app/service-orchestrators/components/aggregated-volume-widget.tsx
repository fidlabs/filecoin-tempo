"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuarterContext } from "@/hooks/use-quarter-context";
import {
  fetchGateTarget,
  fetchQuarterlyVolume,
  fetchQuarterlyVolumePostings,
} from "@/lib/fpv-indexer";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import { divideBigInt } from "@/lib/utils";
import { useMemo, useState } from "react";

type VolumeType = "calculated" | "posted";

interface FetchVolumeParameters {
  volumeType: VolumeType;
  quarterNumber: number;
}

const usdFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "usd",
  useGrouping: true,
});

function fetchVolumeAttoUsd({
  volumeType,
  quarterNumber,
}: FetchVolumeParameters): Promise<bigint> {
  return volumeType === "calculated"
    ? fetchQuarterlyVolume({ quarterNumber }).then((r) => r.volumeAttoUsd)
    : fetchQuarterlyVolumePostings({ quarterNumber }).then(
        (r) => r.aggregatedVolumeAttoUsd
      );
}

const useVolumeAttoUsd = createFetcherHook(
  fetchVolumeAttoUsd,
  "AggregatedVolumeWidget_volumeAttoUsd"
);

const useGateTarget = createFetcherHook(fetchGateTarget, QueryKeys.GATE_TARGET);

export function AggregatedVolumeWidget() {
  const [volumeType, setVolumeType] = useState<VolumeType>("calculated");
  const { quarter } = useQuarterContext();
  const {
    data: gateTarget,
    error: gateTargetError,
    isLoading: isGateTargetLoading,
  } = useGateTarget({
    atEpoch: quarter.endEpoch,
  });
  const capReached = gateTarget?.capReached ?? false;
  const {
    data: volumeAttoUsd,
    error: volumeError,
    isLoading: isVolumeLoading,
  } = useVolumeAttoUsd({ volumeType, quarterNumber: quarter.q });
  const targetAttoUsd = gateTarget?.targetAttoUsd;

  const targetCompletion = useMemo(() => {
    if (targetAttoUsd === undefined || volumeAttoUsd === undefined) return null;
    if (targetAttoUsd === 0n) return 100;

    const value = divideBigInt(volumeAttoUsd * 100n, targetAttoUsd, 0);
    return Math.min(value, 100);
  }, [volumeAttoUsd, targetAttoUsd]);

  const description =
    volumeType === "calculated"
      ? "Calculated from indexed Filecoin Pay payments."
      : "Based on volume posted by Orchestrators.";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Q{quarter.q} Aggregated FPV and Gate Target Completion
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Tabs value={volumeType} onValueChange={setVolumeType}>
            <TabsList>
              <TabsTrigger value="calculated">Calculated</TabsTrigger>
              <TabsTrigger value="posted">Posted</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>

      <CardContent>
        <span className="text-3xl font-semibold tabular-nums">
          {isVolumeLoading && <Skeleton className="h-lh w-[160px]" />}
          {!isVolumeLoading && !!volumeError && (
            <span className="text-destructive">Volume Fetch Error</span>
          )}
          {!isVolumeLoading &&
            !volumeError &&
            (volumeAttoUsd !== undefined
              ? usdFormatter.format(divideBigInt(volumeAttoUsd, 10n ** 18n, 2))
              : "N/A")}
        </span>
      </CardContent>
      <CardFooter className="block">
        {quarter.q === 1 && (
          <div className="h-7.5">
            <p>No target for Q1</p>
          </div>
        )}

        {quarter.q > 1 && capReached && (
          <div className="h-7.5">
            <p>W2 Cap Reached</p>
          </div>
        )}

        {quarter.q > 1 && !capReached && (
          <>
            {targetCompletion !== null ? (
              <Progress value={targetCompletion} />
            ) : (
              <Skeleton className="h-1 w-full" />
            )}

            <div className="mt-1 flex justify-between">
              <span className="text-sm text-muted-foreground">
                {targetCompletion !== null ? (
                  `${targetCompletion}% achieved`
                ) : (
                  <Skeleton className="h-lh w-[120px]" />
                )}
              </span>

              <span className="text-sm font-semibold tabular-nums">
                {isGateTargetLoading && <Skeleton className="h-lh w-[80px]" />}
                {!isGateTargetLoading && !!gateTargetError && (
                  <span className="text-destructive">
                    Gate Target Fetch Error
                  </span>
                )}
                {!isGateTargetLoading &&
                  !gateTargetError &&
                  (targetAttoUsd !== undefined
                    ? usdFormatter.format(
                        divideBigInt(targetAttoUsd, 10n ** 18n, 2)
                      )
                    : "N/A")}
              </span>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
