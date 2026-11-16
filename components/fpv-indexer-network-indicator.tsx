"use client";

import { useFpvIndexerStatus } from "@/hooks/use-fpv-indexer-status";
import {
  filecoinCalibrationChainId,
  filecoinMainnetChainId,
} from "@/lib/constants";
import { ReactNode } from "react";
import { ExplorerActionsMenu } from "./explorer-actions-menu";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

function chainIdToName(chainId: number): string {
  switch (chainId) {
    case filecoinMainnetChainId:
      return "Filecoin Mainnet";
    case filecoinCalibrationChainId:
      return "Calibration Testnet";
    default:
      return "Unknown Network";
  }
}

export function FpvIndexerNetworkIndicator() {
  const { data, isLoading } = useFpvIndexerStatus();

  if (!data || isLoading) {
    return <Skeleton className="h-9 w-24" />;
  }

  const parts = [
    ["Chain ID", data.chainId],
    [
      "Indexed To",
      <div key="indexed-tipset" className="flex items-center">
        {data.indexedUpTo}
        <ExplorerActionsMenu variant="tipset" input={data.indexedUpTo} />
      </div>,
    ],
    ["Version", data.version],
  ] satisfies [string, ReactNode][];

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" className="tabular-nums" />}
      >
        {chainIdToName(data.chainId)}
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <PopoverHeader>
          <PopoverTitle>Indexing Status</PopoverTitle>
        </PopoverHeader>

        {parts.map(([label, content]) => {
          return (
            <div key={label} className="grid grid-cols-3 items-center gap-2">
              <strong>{label}</strong>
              <div className="col-span-2">{content}</div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
