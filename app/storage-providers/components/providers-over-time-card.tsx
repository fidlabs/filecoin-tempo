"use client";

import { BarChartSkeleton } from "@/components/bar-chart-skeleton";
import {
  ChartCard,
  ChartCardContent,
  ChartCardHeader,
  ChartCardHeaderExtra,
  ChartCardHeaderExtraLabel,
  ChartCardHeaderExtraValue,
  ChartCardHeaderText,
  ChartCardProps,
} from "@/components/chart-card";
import { ChartErrorState } from "@/components/chart-error-state";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { useStorageProvidersHistory } from "@/hooks/use-storage-providers-history";
import {
  createChartDateFormatter,
  periodToHyperionWindowSize,
  serviceToHyperionResponseServiceKey,
  serviceToHyperionService,
} from "@/lib/utils";
import { last } from "es-toolkit";
import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  createHorizontalChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

type ChartEntry = {
  date: string;
  total: number;
  increase: number;
};

export type ProvidersOverTimeCardProps = Omit<ChartCardProps, "children">;

const Chart = createHorizontalChart<ChartEntry>()({
  ComposedChart,
  XAxis,
  YAxis,
  Bar,
  Line,
});

export function ProvidersOverTimeCard(props: ProvidersOverTimeCardProps) {
  const { historyPeriod } = useHistoryPeriodContext();
  const { serviceType } = useServiceTypeContext();
  const serviceKey = serviceToHyperionResponseServiceKey(serviceType);
  const windowSize = periodToHyperionWindowSize(historyPeriod);
  const {
    data,
    error,
    mutate: refresh,
  } = useStorageProvidersHistory({
    period: historyPeriod,
    service: serviceToHyperionService(serviceType),
    windowSize,
  });

  const chartData = useMemo<ChartEntry[]>(() => {
    if (!data || error) return [];

    return data.map((item) => {
      return {
        date: item.date,
        total: item.totalProvidersCount[serviceKey] ?? 0,
        increase: item.newProvidersCount[serviceKey] ?? 0,
      } satisfies ChartEntry;
    });
  }, [data, error, serviceKey]);

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
      <ChartCardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <ChartCardHeaderText>
          <CardTitle>Total SPs Over Time</CardTitle>
          <CardDescription>
            New providers, with the running total.
          </CardDescription>
        </ChartCardHeaderText>

        <ChartCardHeaderExtra>
          <ChartCardHeaderExtraValue
            value={
              data ? (last(data)?.totalProvidersCount[serviceKey] ?? "-") : null
            }
            error={!!error}
          />
          <ChartCardHeaderExtraLabel>Total Today</ChartCardHeaderExtraLabel>
        </ChartCardHeaderExtra>
      </ChartCardHeader>
      <ChartCardContent className="h-[200px]">
        {!!error && <ChartErrorState onRefresh={refresh} />}
        {!data && !error && <BarChartSkeleton />}
        {!!data && !error && (
          <ChartContainer
            config={{
              increase: {
                label: "New Providers (left)",
                color: "var(--chart-1)",
              },
              total: {
                label: "Total Providers (right)",
                color: "var(--chart-2)",
              },
            }}
            className="aspect-auto h-[200px] w-full"
          >
            <Chart.ComposedChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <Chart.XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={formatXAxisTick}
              />
              <Chart.YAxis
                yAxisId="increase"
                width="auto"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <Chart.YAxis
                yAxisId="total"
                width="auto"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent labelFormatter={formatTooltipLabel} />
                }
              />
              <ChartLegend
                content={<ChartLegendContent className="justify-start" />}
              />
              <Chart.Bar
                dataKey="increase"
                yAxisId="increase"
                fill="var(--color-increase)"
                maxBarSize={24}
                animationDuration={250}
              />
              <Chart.Line
                dataKey="total"
                yAxisId="total"
                dot={false}
                stroke="var(--color-total)"
                strokeWidth={2}
                animationDuration={250}
              />
            </Chart.ComposedChart>
          </ChartContainer>
        )}
      </ChartCardContent>
    </ChartCard>
  );
}
