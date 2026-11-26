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
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { fetchClientsReturningHistory } from "@/lib/hyperion";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import {
  createChartDateFormatter,
  serviceToHyperionResponseServiceKey,
  serviceToHyperionService,
} from "@/lib/utils";
import { useMemo, type ComponentProps } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  createHorizontalChart,
  XAxis,
  YAxis,
} from "recharts";

type ChartEntry = {
  date: string;
  newDatasets: number;
  extendedDeals: number;
};

type CardProps = ComponentProps<typeof Card>;

export type ReturningClientsOverTimeCardProps = Omit<CardProps, "children">;

const useHistory = createFetcherHook(
  fetchClientsReturningHistory,
  QueryKeys.CLIENTS_RETURNING_HISTORY
);

const Chart = createHorizontalChart<ChartEntry>()({
  BarChart,
  XAxis,
  YAxis,
  Bar,
});

export function ReturningClientsOverTimeCard(
  props: ReturningClientsOverTimeCardProps
) {
  const { historyPeriod } = useHistoryPeriodContext();
  const { serviceType } = useServiceTypeContext();
  const key = serviceToHyperionResponseServiceKey(serviceType);

  const {
    data,
    error,
    mutate: refresh,
  } = useHistory({
    period: historyPeriod,
    service: serviceToHyperionService(serviceType),
  });

  const chartData = useMemo<ChartEntry[]>(() => {
    if (!data || error) return [];

    return data.map((item) => {
      return {
        date: item.date,
        newDatasets: item.onboardedNewDatasetsClientsCount[key] ?? 0,
        extendedDeals: item.extendedDealsClientsCount[key] ?? 0,
      } satisfies ChartEntry;
    });
  }, [data, error, key]);

  const formatXAxisTick = useMemo(
    () =>
      createChartDateFormatter({ weekDisplay: "start", windowSize: "month" }),
    []
  );
  const formatTooltipLabel = useMemo(
    () => createChartDateFormatter({ windowSize: "month" }),
    []
  );

  return (
    <ChartCard {...props}>
      <ChartCardHeader className="border-b">
        <ChartCardHeaderText>
          <CardTitle>Returning Clients Over Time</CardTitle>
          <CardDescription>
            Returning clients per month, by what they did.
          </CardDescription>
        </ChartCardHeaderText>
      </ChartCardHeader>
      <ChartCardContent className="h-[200px]">
        {!!error && <ChartErrorState onRefresh={refresh} />}
        {!data && !error && <BarChartSkeleton />}
        {!!data && !error && (
          <ChartContainer
            config={{
              extendedDeals: {
                label: "Extended Deals",
                color: "var(--chart-1)",
              },
              newDatasets: {
                label: "Onboarded New Datasets",
                color: "var(--chart-2)",
              },
            }}
            className="aspect-auto h-[200px] w-full"
          >
            <Chart.BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <Chart.XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={formatXAxisTick}
              />
              <Chart.YAxis
                width="auto"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                allowDecimals={false}
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

              <Chart.Bar
                dataKey="newDatasets"
                stackId="returningClients"
                fill="var(--color-newDatasets)"
              />

              <Chart.Bar
                dataKey="extendedDeals"
                stackId="returningClients"
                fill="var(--color-extendedDeals)"
              />
            </Chart.BarChart>
          </ChartContainer>
        )}
      </ChartCardContent>
    </ChartCard>
  );
}
