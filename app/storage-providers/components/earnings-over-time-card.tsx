"use client";

import { BarChartSkeleton } from "@/components/bar-chart-skeleton";
import {
  ChartCard,
  ChartCardContent,
  ChartCardHeader,
  ChartCardHeaderText,
  type ChartCardProps,
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { FcssPaymentsHistory, fetchFcssPaymentsHistory } from "@/lib/hyperion";
import { createFetcherHook, QueryKeys } from "@/lib/swr";
import {
  createChartDateFormatter,
  periodToHyperionWindowSize,
} from "@/lib/utils";
import { DatabaseXIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  createHorizontalChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

export type EarningsOverTimeCardProps = Omit<ChartCardProps, "children">;

type ChartEntry = FcssPaymentsHistory[number];

const Chart = createHorizontalChart<ChartEntry>()({
  ComposedChart,
  XAxis,
  YAxis,
  Bar,
  Line,
});

const useHistory = createFetcherHook(
  fetchFcssPaymentsHistory,
  QueryKeys.FCSS_PAYMENTS_HISTORY
);

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  compactDisplay: "short",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export function EarningsOverTimeCard(props: EarningsOverTimeCardProps) {
  const { historyPeriod } = useHistoryPeriodContext();
  const { serviceType } = useServiceTypeContext();
  const windowSize = periodToHyperionWindowSize(historyPeriod);
  const { data, error, mutate: refetch } = useHistory({ windowSize });

  const formatXAxisTick = useMemo(
    () => createChartDateFormatter({ weekDisplay: "start", windowSize }),
    [windowSize]
  );
  const formatTooltipLabel = useMemo(
    () => createChartDateFormatter({ windowSize }),
    [windowSize]
  );

  const formatUsdValue = useCallback((value: unknown) => {
    return typeof value === "number"
      ? usdFormatter.format(value)
      : String(value);
  }, []);

  return (
    <ChartCard {...props}>
      <ChartCardHeader>
        <ChartCardHeaderText>
          <CardTitle>Earnings Over Time</CardTitle>
          <CardDescription>
            Net amounts recived by SP from settlements, with the running total.
          </CardDescription>
        </ChartCardHeaderText>
      </ChartCardHeader>

      {serviceType === "FWSS" ? (
        <ChartCardContent className="h-[200px]">
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <DatabaseXIcon />
              </EmptyMedia>
              <EmptyDescription>FWSS data not available.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </ChartCardContent>
      ) : (
        <ChartCardContent className="h-[200px]">
          {!!error && <ChartErrorState onRefresh={refetch} />}
          {!data && !error && <BarChartSkeleton />}
          {!!data && !error && (
            <ChartContainer
              config={{
                volumeUSD: {
                  label: "Volume (left)",
                  color: "var(--chart-1)",
                },
                cumulativeTotalUSD: {
                  label: "Total (right)",
                  color: "var(--chart-2)",
                },
              }}
              className="aspect-auto h-[200px] w-full"
            >
              <Chart.ComposedChart accessibilityLayer data={data ?? []}>
                <CartesianGrid vertical={false} yAxisId="volume" />
                <Chart.XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={formatXAxisTick}
                />
                <Chart.YAxis
                  yAxisId="volume"
                  width="auto"
                  orientation="left"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tickFormatter={formatUsdValue}
                  interval={0}
                />
                <Chart.YAxis
                  yAxisId="total"
                  width="auto"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tickFormatter={formatUsdValue}
                  interval={0}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={formatTooltipLabel}
                      valueFormatter={formatUsdValue}
                    />
                  }
                />
                <ChartLegend
                  content={<ChartLegendContent className="justify-start" />}
                />
                <Chart.Bar
                  dataKey="volumeUSD"
                  yAxisId="volume"
                  fill="var(--color-volumeUSD)"
                  maxBarSize={24}
                  animationDuration={250}
                />
                <Chart.Line
                  dataKey="cumulativeTotalUSD"
                  yAxisId="total"
                  dot={false}
                  stroke="var(--color-cumulativeTotalUSD)"
                  strokeWidth={2}
                  animationDuration={250}
                />
              </Chart.ComposedChart>
            </ChartContainer>
          )}
        </ChartCardContent>
      )}
    </ChartCard>
  );
}
