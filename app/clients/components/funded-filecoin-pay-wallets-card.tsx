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
import { Skeleton } from "@/components/ui/skeleton";
import { useClientsStatistics } from "@/hooks/use-clients-statistics";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { serviceToHyperionResponseServiceKey } from "@/lib/utils";

const formatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
});

const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

export function FundedFilecoinPayWalletsCard() {
  const { historyPeriod } = useHistoryPeriodContext();
  const { serviceType } = useServiceTypeContext();
  const { data, isValidating } = useClientsStatistics({
    period: historyPeriod,
  });

  const isLoading = useDelayedFlag(isValidating, 500);
  const key = serviceToHyperionResponseServiceKey(serviceType);
  const current = data?.current.fundedWalletsCount[key] ?? null;
  const previous = data?.previous?.fundedWalletsCount[key] ?? null;
  const percentage = data?.current.fundedWalletsPercentage[key] ?? null;
  const value = typeof current === "number" ? formatter.format(current) : "-";

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
          Funded Filecoin Pay Wallets
        </ServiceKpiCardHeading>
      </CardHeader>
      <ServiceKpiCardContent>
        <ServiceKpiCardValue>{data ? value : null}</ServiceKpiCardValue>
        <ServiceKpiCardChange change={change} />
        <p className="text-sm text-muted-foreground">
          {data ? (
            percentage !== null ? (
              `${percentageFormatter.format(percentage)} of clients`
            ) : null
          ) : (
            <Skeleton as="span" className="h-lh w-24" />
          )}
        </p>
      </ServiceKpiCardContent>
    </ServiceKpiCard>
  );
}
