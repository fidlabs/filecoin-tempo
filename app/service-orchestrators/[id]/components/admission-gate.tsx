"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useQuarterContext } from "@/hooks/use-quarter-context";
import {
  ServiceOrchestrator,
  wasOrchestratorActiveInQuarter,
} from "@/lib/fpv-indexer";
import { ArrowLeftIcon, ListXIcon } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export type AdmissionGateProps = PropsWithChildren<{
  admissionPeriods: ServiceOrchestrator["admissionPeriods"];
}>;

export function AdmissionGate({
  admissionPeriods,
  children,
}: AdmissionGateProps) {
  const { quarter } = useQuarterContext();

  if (
    !wasOrchestratorActiveInQuarter({
      admissionPeriods,
      quarterBoundaries: quarter,
    })
  ) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListXIcon />
          </EmptyMedia>
          <EmptyTitle>Not admitted</EmptyTitle>
          <EmptyDescription>
            Service Orchestrator was not addmitted during Q{quarter.q}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            className={buttonVariants({ variant: "link" })}
            href={`/service-orchestrators?q=${quarter.q}`}
          >
            <ArrowLeftIcon />
            Go back to Q{quarter.q} summary
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return children;
}
