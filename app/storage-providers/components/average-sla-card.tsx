"use client";

import { historyPeriodLabel } from "@/components/history-period-context";
import {
  ServiceKpiCard,
  ServiceKpiCardChange,
  ServiceKpiCardChangeProps,
  ServiceKpiCardContent,
  ServiceKpiCardHeading,
  ServiceKpiCardValue,
} from "@/components/service-kpi-card";
import { CardHeader } from "@/components/ui/card";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { useStorageProvidersStatistics } from "@/hooks/use-storage-providers-statistics";
import { serviceToHyperionResponseServiceKey } from "@/lib/utils";

const formatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
});

export function AverageSlaCard() {
  const { serviceType } = useServiceTypeContext();
  const { historyPeriod } = useHistoryPeriodContext();
  const { data, isValidating } = useStorageProvidersStatistics({
    period: historyPeriod,
  });

  const isLoading = useDelayedFlag(isValidating, 500);
  const key = serviceToHyperionResponseServiceKey(serviceType);
  const current = data?.current.averageSla[key] ?? null;
  const previous = data?.previous?.averageSla[key] ?? null;
  const value = formatter.format(typeof current === "number" ? current : 0);

  const change = isLoading
    ? null
    : ({
        type: "points",
        value:
          current === null || previous === null || previous === 0
            ? null
            : current / previous - 1,
        window: historyPeriodLabel(historyPeriod),
      } satisfies ServiceKpiCardChangeProps["change"]);

  return (
    <ServiceKpiCard>
      <CardHeader>
        <ServiceKpiCardHeading>Average SLA</ServiceKpiCardHeading>
      </CardHeader>
      <ServiceKpiCardContent>
        {serviceType === "all" ? (
          <p className="mt-3 text-center text-muted-foreground">
            Select specific service to see average SLA stats.
          </p>
        ) : (
          <>
            <ServiceKpiCardValue>{data ? value : null}</ServiceKpiCardValue>
            <ServiceKpiCardChange change={change} />
          </>
        )}
      </ServiceKpiCardContent>
    </ServiceKpiCard>
  );
}
