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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { fetchClientsRevenueConcentrationHistory } from "@/lib/hyperion";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import {
  createChartDateFormatter,
  getServiceColor,
  periodToHyperionWindowSize,
  serviceToHyperionResponseServiceKey,
  serviceToHyperionService,
} from "@/lib/utils";
import { DatabaseXIcon } from "lucide-react";
import { useMemo, type ComponentProps } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type ChartEntry = {
  date: string;
  concentration: number;
};

type CardProps = ComponentProps<typeof Card>;

export type ConcentrationOfRevenueCardProps = Omit<CardProps, "children">;

const useHistory = createFetcherHook(
  fetchClientsRevenueConcentrationHistory,
  QueryKeys.CLIENTS_REVENUE_CONCENTRATION_HISTORY
);

const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

export function ConcentrationOfRevenueCard(
  props: ConcentrationOfRevenueCardProps
) {
  const { historyPeriod } = useHistoryPeriodContext();
  const { serviceType } = useServiceTypeContext();
  const windowSize = periodToHyperionWindowSize(historyPeriod);
  const key = serviceToHyperionResponseServiceKey(serviceType);

  const {
    data,
    error,
    mutate: refresh,
  } = useHistory({
    period: historyPeriod,
    service: serviceToHyperionService(serviceType),
    windowSize,
  });

  const chartData = useMemo<ChartEntry[]>(() => {
    if (!data || error) return [];

    return data.flatMap((item) => {
      const concentration = item.topClientsRevenueShare[key];
      if (concentration === null || concentration === undefined) return [];

      return [
        {
          date: item.date,
          concentration,
        } satisfies ChartEntry,
      ];
    });
  }, [data, error, key]);

  const formatXAxisTick = useMemo(
    () => createChartDateFormatter({ weekDisplay: "start", windowSize }),
    [windowSize]
  );
  const formatTooltipLabel = useMemo(
    () => createChartDateFormatter({ windowSize }),
    [windowSize]
  );

  const formatePercentage = useMemo(
    () => (value: unknown) => {
      return typeof value === "number"
        ? percentageFormatter.format(value)
        : String(value);
    },
    []
  );

  return (
    <ChartCard {...props}>
      <ChartCardHeader className="border-b">
        <ChartCardHeaderText>
          <CardTitle>Concentration of Revenue</CardTitle>
          <CardDescription>
            Share of revenue paid by the 10 largest clients.
          </CardDescription>
        </ChartCardHeaderText>
      </ChartCardHeader>
      <ChartCardContent className="h-[200px]">
        {!!error && <ChartErrorState onRefresh={refresh} />}
        {!data && !error && <BarChartSkeleton />}
        {!!data && !error && chartData.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <DatabaseXIcon />
              </EmptyMedia>
              <EmptyDescription>No data available.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {!!data && !error && chartData.length > 0 && (
          <ChartContainer
            config={{
              concentration: {
                label: "Top 10 Clients",
                color:
                  serviceType === "all"
                    ? "var(--chart-1)"
                    : getServiceColor(serviceType),
              },
            }}
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
                tickFormatter={formatePercentage}
                domain={[0, 1]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={formatTooltipLabel}
                    formatter={formatePercentage}
                  />
                }
              />

              <Line
                dataKey="concentration"
                dot={false}
                stroke="var(--color-concentration)"
                strokeWidth={2}
                animationDuration={250}
              />
            </LineChart>
          </ChartContainer>
        )}
      </ChartCardContent>
    </ChartCard>
  );
}
