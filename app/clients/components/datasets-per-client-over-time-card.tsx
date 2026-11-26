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
import { useClientsHistory } from "@/hooks/use-clients-history";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import {
  createChartDateFormatter,
  getServiceColor,
  periodToHyperionWindowSize,
  serviceToHyperionResponseServiceKey,
  serviceToHyperionService,
} from "@/lib/utils";
import { useMemo, type ComponentProps } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type ChartEntry = {
  date: string;
  average: number;
};

type CardProps = ComponentProps<typeof Card>;

export type DatasetsPerClientOverTimeCardProps = Omit<CardProps, "children">;

export function DatasetsPerClientOverTimeCard(
  props: DatasetsPerClientOverTimeCardProps
) {
  const { historyPeriod } = useHistoryPeriodContext();
  const { serviceType } = useServiceTypeContext();
  const windowSize = periodToHyperionWindowSize(historyPeriod);
  const key = serviceToHyperionResponseServiceKey(serviceType);

  const {
    data,
    error,
    mutate: refresh,
  } = useClientsHistory({
    period: historyPeriod,
    service: serviceToHyperionService(serviceType),
    windowSize,
  });

  const chartData = useMemo<ChartEntry[]>(() => {
    if (!data || error) return [];

    return data.map((item) => {
      return {
        date: item.date,
        average: item.averageDatasetsPerClient[key] ?? 0,
      } satisfies ChartEntry;
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

  return (
    <ChartCard {...props}>
      <ChartCardHeader className="border-b">
        <ChartCardHeaderText>
          <CardTitle>Datasets Per Client Over Time</CardTitle>
          <CardDescription>
            Average number of datasets per client, by service.
          </CardDescription>
        </ChartCardHeaderText>
      </ChartCardHeader>
      <ChartCardContent className="h-[200px]">
        {!!error && <ChartErrorState onRefresh={refresh} />}
        {!data && !error && <BarChartSkeleton />}
        {!!data && !error && (
          <ChartContainer
            config={{
              average: {
                label: "Average",
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
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent labelFormatter={formatTooltipLabel} />
                }
              />

              <Line
                dataKey="average"
                dot={false}
                stroke="var(--color-average)"
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
