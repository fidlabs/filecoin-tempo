"use client";

import { NotImplementedOverlay } from "@/components/not-implemented-overlay";
import { ServiceKpiCard } from "@/components/service-kpi-card";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { pick } from "es-toolkit";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
});

const allValues = { FCSS: 1070000, FWSS: 930000 } as const;

export function FilecoinPayVolumeCard() {
  const { serviceType } = useServiceTypeContext();

  return (
    <ServiceKpiCard
      className="relative"
      heading="Volume Throught Filecoin Pay"
      link={{
        href: "/economics",
        label: "History",
      }}
      values={
        serviceType === "all" ? allValues : pick(allValues, [serviceType])
      }
      change={{ value: 0.071, window: "30 days" }}
      formatValue={formatter.format}
    >
      <NotImplementedOverlay className="rounded-lg" />
    </ServiceKpiCard>
  );
}
