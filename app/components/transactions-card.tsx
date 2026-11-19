"use client";

import { NotImplementedOverlay } from "@/components/not-implemented-overlay";
import { ServiceKpiCard } from "@/components/service-kpi-card";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { pick } from "es-toolkit";

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 2,
});

const allValues = { FCSS: 31400, FWSS: 64800 } as const;

export function TransactionsCard() {
  const { serviceType } = useServiceTypeContext();

  return (
    <ServiceKpiCard
      className="relative"
      heading="Transactions"
      link={{
        href: "/economics",
        label: "History",
      }}
      values={
        serviceType === "all" ? allValues : pick(allValues, [serviceType])
      }
      change={{ value: 0.052, window: "30 days" }}
      formatValue={formatter.format}
    >
      <NotImplementedOverlay className="rounded-lg" />
    </ServiceKpiCard>
  );
}
