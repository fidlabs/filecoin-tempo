"use client";

import { historyPeriodLabel } from "@/components/history-period-context";
import {
  ServiceKpiCard,
  ServiceKpiCardBreakdown,
  ServiceKpiCardBreakdownProps,
  ServiceKpiCardChange,
  ServiceKpiCardChangeProps,
  ServiceKpiCardContent,
  ServiceKpiCardHeading,
  ServiceKpiCardValue,
} from "@/components/service-kpi-card";
import { CardHeader } from "@/components/ui/card";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useStorageProvidersStatistics } from "@/hooks/use-storage-providers-statistics";
import { supportedServices } from "@/lib/constants";
import { serviceToHyperionResponseServiceKey } from "@/lib/utils";

const formatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
});

export function TotalProvidersCard() {
  const { historyPeriod } = useHistoryPeriodContext();
  const { data, isValidating } = useStorageProvidersStatistics({
    period: historyPeriod,
  });

  const isLoading = useDelayedFlag(isValidating, 500);
  const current = data?.current.totalProvidersCount.total ?? null;
  const previous = data?.previous?.totalProvidersCount.total ?? null;
  const value = typeof current === "number" ? formatter.format(current) : "-";

  const breakdownValues = supportedServices.reduce(
    (values, service) => {
      const value =
        data?.current.totalProvidersCount[
          serviceToHyperionResponseServiceKey(service)
        ];

      return {
        ...values,
        [service]: isLoading
          ? null
          : typeof value === "number"
            ? formatter.format(value)
            : "N/A",
      };
    },
    { FCSS: null, FWSS: null } satisfies ServiceKpiCardBreakdownProps["values"]
  );

  const change = isLoading
    ? null
    : ({
        type: "percent",
        value:
          current === null || previous === null || previous === 0
            ? null
            : current / previous - 1,
        window: historyPeriodLabel(historyPeriod),
      } satisfies ServiceKpiCardChangeProps["change"]);

  return (
    <ServiceKpiCard>
      <CardHeader>
        <ServiceKpiCardHeading>Total SPs</ServiceKpiCardHeading>
      </CardHeader>
      <ServiceKpiCardContent>
        <ServiceKpiCardValue>{data ? value : null}</ServiceKpiCardValue>
        <ServiceKpiCardChange change={change} />
        <ServiceKpiCardBreakdown values={breakdownValues} compact />
      </ServiceKpiCardContent>
    </ServiceKpiCard>
  );
}
