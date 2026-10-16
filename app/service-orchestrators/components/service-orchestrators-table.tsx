"use client";

import { ExplorerActionsMenu } from "@/components/explorer-actions-menu";
import { buttonVariants } from "@/components/ui/button";
import { useQuarterContext } from "@/hooks/use-quarter-context";
import { createAppColumnHelper, useAppTable } from "@/lib/app-table";
import {
  fetchServiceOrchestrators,
  wasOrchestratorActiveInQuarter,
  type ServiceOrchestrator,
} from "@/lib/fpv-indexer";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import { shortenAddress } from "@/lib/utils";
import { last } from "es-toolkit";
import Link from "next/link";
import { useMemo } from "react";
import { ServiceOrchestratorCalculatedQuarterlyVolume } from "./service-orchestrator-calculated-quarterly-volume";

const useOrchestrators = createFetcherHook(
  fetchServiceOrchestrators,
  QueryKeys.SERVICE_ORCHESTRATORS
);

const columnHelper = createAppColumnHelper<ServiceOrchestrator>();

export function ServiceOrchestratorsTable() {
  const { quarter } = useQuarterContext();
  const { data, error, isLoading } = useOrchestrators();

  const columns = useMemo(() => {
    return columnHelper.columns([
      columnHelper.accessor("id", {
        header: "ID",
        cell({ getValue }) {
          const address = getValue();

          return (
            <div className="flex items-center gap-x-1">
              <span className="font-mono">{shortenAddress(address)}</span>
              <ExplorerActionsMenu variant="address" input={address} />
            </div>
          );
        },
      }),
      columnHelper.display({
        header: "Wallet",
        cell({ row }) {
          const lastAdmission = last(row.original.admissionPeriods);

          if (!lastAdmission) {
            return "N/A";
          }

          const address = lastAdmission.wallet;

          return (
            <div className="flex items-center gap-x-1">
              <span className="font-mono">{shortenAddress(address)}</span>
              <ExplorerActionsMenu variant="address" input={address} />
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "quarterly-volume",
        header: `FPV(Q${quarter.q})`,
        cell({ row }) {
          return (
            <ServiceOrchestratorCalculatedQuarterlyVolume
              className="font-semibold"
              quarterNumber={quarter.q}
              serviceOrchestrator={row.original.id}
            />
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        size: 124,
        maxSize: 124,
        cell({ row }) {
          return (
            <Link
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              href={`/service-orchestrators/${row.original.id}?q=${quarter.q}`}
            >
              View Details
            </Link>
          );
        },
      }),
    ]);
  }, [quarter]);

  const table = useAppTable({
    columns,
    data:
      data?.filter((orchestrator) => {
        return wasOrchestratorActiveInQuarter({
          admissionPeriods: orchestrator.admissionPeriods,
          quarterBoundaries: quarter,
        });
      }) ?? [],
  });

  return (
    <table.AppTable>
      <table.Content error={error} loading={isLoading} />
    </table.AppTable>
  );
}
