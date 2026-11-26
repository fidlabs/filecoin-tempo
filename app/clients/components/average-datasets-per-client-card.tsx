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
import { useClientsStatistics } from "@/hooks/use-clients-statistics";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { supportedServices } from "@/lib/constants";
import { serviceToHyperionResponseServiceKey } from "@/lib/utils";

const formatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 2,
});

export function AverageDatasetsPerClientCard() {
  const { historyPeriod } = useHistoryPeriodContext();
  const { data, isValidating } = useClientsStatistics({
    period: historyPeriod,
  });

  const isLoading = useDelayedFlag(isValidating, 500);
  const current = data?.current.averageDatasetsPerClient.total ?? null;
  const previous = data?.previous?.averageDatasetsPerClient.total ?? null;
  const value = typeof current === "number" ? formatter.format(current) : "-";

  const breakdownValues = supportedServices.reduce(
    (values, service) => {
      const value =
        data?.current.averageDatasetsPerClient[
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
        <ServiceKpiCardHeading>
          Average Datasets Per Client
        </ServiceKpiCardHeading>
      </CardHeader>
      <ServiceKpiCardContent>
        <ServiceKpiCardValue>{data ? value : null}</ServiceKpiCardValue>
        <ServiceKpiCardChange change={change} />
        <ServiceKpiCardBreakdown values={breakdownValues} compact />
      </ServiceKpiCardContent>
    </ServiceKpiCard>
  );
}
