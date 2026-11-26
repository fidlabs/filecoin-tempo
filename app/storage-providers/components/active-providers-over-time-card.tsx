"use client";

import { BarChartSkeleton } from "@/components/bar-chart-skeleton";
import {
  ChartCard,
  ChartCardContent,
  ChartCardHeader,
  ChartCardHeaderText,
} from "@/components/chart-card";
import { ChartErrorState } from "@/components/chart-error-state";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { useStorageProvidersHistory } from "@/hooks/use-storage-providers-history";
import { supportedServices } from "@/lib/constants";
import { SupportedService } from "@/lib/types";
import {
  createChartDateFormatter,
  getServiceColor,
  periodToHyperionWindowSize,
  serviceToHyperionResponseServiceKey,
  serviceToHyperionService,
} from "@/lib/utils";
import { useMemo, type ComponentProps } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type ChartEntryValues = Partial<Record<SupportedService, number>>;

type ChartEntry = {
  date: string;
} & ChartEntryValues;

type CardProps = ComponentProps<typeof Card>;

export type ActiveProvidersOverTimeCardProps = Omit<CardProps, "children">;

export function ActiveProvidersOverTimeCard(
  props: ActiveProvidersOverTimeCardProps
) {
  const { historyPeriod } = useHistoryPeriodContext();
  const { serviceType } = useServiceTypeContext();
  const windowSize = periodToHyperionWindowSize(historyPeriod);
  const services = useMemo<SupportedService[]>(() => {
    return serviceType === "all" ? supportedServices : [serviceType];
  }, [serviceType]);

  const {
    data,
    error,
    mutate: refresh,
  } = useStorageProvidersHistory({
    period: historyPeriod,
    service: serviceToHyperionService(serviceType),
    windowSize,
  });

  const config = services.reduce<ChartConfig>((result, service) => {
    return {
      ...result,
      [service]: {
        label: service,
        color: getServiceColor(service),
      },
    } satisfies ChartConfig;
  }, {});

  const chartData = useMemo<ChartEntry[]>(() => {
    if (!data || error) return [];

    return data.map((item) => {
      const values = services.reduce<ChartEntryValues>((result, service) => {
        return {
          ...result,
          [service]:
            item.activeProvidersCount[
              serviceToHyperionResponseServiceKey(service)
            ],
        };
      }, {});

      return {
        date: item.date,
        ...values,
      } satisfies ChartEntry;
    });
  }, [data, error, services]);

  const formatXAxisTick = useMemo(
    () => createChartDateFormatter({ weekDisplay: "start", windowSize }),
    [windowSize]
  );
  const formatTooltipLabel = useMemo(
    () => createChartDateFormatter({ windowSize }),
    [windowSize]
  );

  return (
    <ChartCard {...props}>
      <ChartCardHeader className="border-b">
        <ChartCardHeaderText>
          <CardTitle>Active SPs Over Time</CardTitle>
          <CardDescription>
            Providers with activity, by service.
          </CardDescription>
        </ChartCardHeaderText>
      </ChartCardHeader>
      <ChartCardContent className="h-[200px]">
        {!!error && <ChartErrorState onRefresh={refresh} />}
        {!data && !error && <BarChartSkeleton />}
        {!!data && !error && (
          <ChartContainer
            config={config}
            className="aspect-auto h-[200px] w-full"
          >
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={formatXAxisTick}
              />
              <YAxis
                width="auto"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                interval={0}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent labelFormatter={formatTooltipLabel} />
                }
              />
              <ChartLegend
                content={<ChartLegendContent className="justify-start" />}
              />

              {services.map((service) => (
                <Line
                  key={service}
                  dataKey={service}
                  dot={false}
                  stroke={`var(--color-${service})`}
                  strokeWidth={2}
                  animationDuration={250}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </ChartCardContent>
    </ChartCard>
  );
}
