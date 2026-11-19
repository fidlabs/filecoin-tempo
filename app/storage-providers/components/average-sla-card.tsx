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
  const services: SupportedService[] =
    serviceType === "all" ? ["FCSS", "FWSS"] : [serviceType];
  const key = serviceToHyperionResponseServiceKey(serviceType);
  const current = data?.current.averageSla[key] ?? null;
  const previous = data?.previous?.averageSla[key] ?? null;

  const values = services.reduce<ServiceKpiCardProps["values"]>(
    (values, service) => {
      return {
        ...values,
        [service]: isLoading
          ? null
          : (data?.current.averageSla[
              serviceToHyperionResponseServiceKey(service)
            ] ?? null),
      };
    },
    {}
  );

  const change: ServiceKpiCardProps["change"] =
    current === null || previous === null
      ? null
      : {
          value: current - previous,
          window: historyPeriodLabel(historyPeriod),
          type: "points",
        };

  return (
    <ServiceKpiCard
      heading="Average SLA"
      values={values}
      change={change}
      hideChange={historyPeriod === "all" || (!!data && change === null)}
      hidePieChart
      compact
      formatValue={formatter.format}
    />
  );
}
