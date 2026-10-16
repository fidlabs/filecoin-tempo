import { filecoinCalibrationChainId } from "@/lib/constants";
import { createFilecoinPayRailUrl } from "@/lib/filecoin-pay";
import { fetchStatus } from "@/lib/fpv-indexer";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Skeleton } from "./ui/skeleton";

export type FilecoinPayRailButtonLinkProps = {
  railId: bigint | number;
};

const useStatus = createFetcherHook(fetchStatus, QueryKeys.FPV_INDEXER_STATUS);

export function FilecoinPayRailButtonLink({
  railId,
}: FilecoinPayRailButtonLinkProps) {
  const { data: status } = useStatus();

  return status ? (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Link
            className={cn(
              buttonVariants({ variant: "link" }),
              "px-0 tabular-nums"
            )}
            href={createFilecoinPayRailUrl({
              railId,
              testnet: status.chainId === filecoinCalibrationChainId,
            })}
            target="_blank"
          />
        }
      >
        {railId}
        <ExternalLinkIcon />
      </HoverCardTrigger>
      <HoverCardContent side="bottom">
        <p className="mb-1 font-semibold">Filecoin Pay</p>
        <p className="text-xs text-muted-foreground">
          Browse Rail {railId} details.
        </p>
      </HoverCardContent>
    </HoverCard>
  ) : (
    <Skeleton className="h-lh w-12" />
  );
}
