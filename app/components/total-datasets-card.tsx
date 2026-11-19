"use client";

import { NotImplementedOverlay } from "@/components/not-implemented-overlay";
import { ServiceKpiCard } from "@/components/service-kpi-card";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { pick } from "es-toolkit";

const formatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
});

const allValues = { FCSS: 9120, FWSS: 3360 } as const;

export function TotalDatasetsCard() {
  const { serviceType } = useServiceTypeContext();

  return (
    <ServiceKpiCard
      className="relative"
      heading="Total Datasets"
      link={{
        href: "/datasets",
        label: "History",
      }}
      values={
        serviceType === "all" ? allValues : pick(allValues, [serviceType])
      }
      change={{ value: 0.042, window: "30 days" }}
      formatValue={formatter.format}
    >
      <NotImplementedOverlay className="rounded-lg" />
    </ServiceKpiCard>
  );
}
