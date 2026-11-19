"use client";

import { historyPeriodLabel } from "@/components/history-period-context";
import {
  ServiceKpiCard,
  ServiceKpiCardProps,
} from "@/components/service-kpi-card";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { useStorageProvidersStatistics } from "@/hooks/use-storage-providers-statistics";
import { SupportedService } from "@/lib/types";
import { serviceToHyperionResponseServiceKey } from "@/lib/utils";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  compactDisplay: "short",
});

export function EarningsCard() {
  const { serviceType } = useServiceTypeContext();
  const { historyPeriod } = useHistoryPeriodContext();
  const { data, isValidating } = useStorageProvidersStatistics({
    period: historyPeriod,
  });

  const isLoading = useDelayedFlag(isValidating, 500);
  const services: SupportedService[] =
    serviceType === "all" ? ["FCSS", "FWSS"] : [serviceType];
  const key = serviceToHyperionResponseServiceKey(serviceType);
  const current = data?.current.earningsUSD[key] ?? null;
  const previous = data?.previous?.earningsUSD[key] ?? null;

  const values = services.reduce<ServiceKpiCardProps["values"]>(
    (values, service) => {
      return {
        ...values,
        [service]: isLoading
          ? null
          : (data?.current.earningsUSD[
              serviceToHyperionResponseServiceKey(service)
            ] ?? null),
      };
    },
    {}
  );

  const change =
    current === null || previous === null || previous === 0
      ? null
      : {
          value: current / previous - 1,
          window: historyPeriodLabel(historyPeriod),
        };

  return (
    <ServiceKpiCard
      heading="Earnings"
      values={values}
      change={change}
      hideChange={historyPeriod === "all" || previous === 0}
      hidePieChart
      compact
      formatValue={formatter.format}
    />
  );
}
