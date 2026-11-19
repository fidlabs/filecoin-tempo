"use client";

import { type SupportedService } from "@/lib/types";
import { Fragment, useMemo, type ComponentProps, type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ArrowRightIcon, DotIcon } from "lucide-react";
import { cn, getServiceColor } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Pie, PieChart } from "recharts";
import { Skeleton } from "./ui/skeleton";

type Value = number;
type ValueFormatFn = (value: Value) => string;
type ChartEntry = {
  label: string;
  value: number;
  fill: string;
};
type CardProps = ComponentProps<typeof Card>;

export type ServiceKpiCardProps = CardProps & {
  change: {
    type?: "percent" | "points";
    value: number;
    window: string;
  } | null;
  compact?: boolean;
  heading: ReactNode;
  hideChange?: boolean;
  hidePieChart?: boolean;
  link?: {
    href: string;
    label: string;
  };
  negativeIncrease?: boolean;
  values: {
    [K in SupportedService]?: Value | null;
  };
  formatValue?: ValueFormatFn;
};

const defaultFormatValue: ValueFormatFn = (value) => value.toString();

export function ServiceKpiCard({
  change,
  children,
  className,
  compact = false,
  heading,
  hideChange = false,
  hidePieChart = false,
  link,
  negativeIncrease = false,
  values,
  formatValue = defaultFormatValue,
  ...rest
}: ServiceKpiCardProps) {
  const changeFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: change?.type === "points" ? "decimal" : "percent",
      signDisplay: "always",
      maximumFractionDigits: 2,
      minimumFractionDigits: 1,
    });
  }, [change?.type]);

  const total = Object.values(values).reduce<Value>(
    (sum, i) => (typeof i === "number" ? sum + i : sum),
    0
  );

  const chartData = useMemo(() => {
    const entries = Object.entries(values).map(([service, value]) => {
      if (value === null) return null;

      return {
        label: service,
        value,
        fill: getServiceColor(service as SupportedService),
      } satisfies ChartEntry;
    });

    if (entries.some((e) => e === null)) return null;
    return entries as ChartEntry[];
  }, [values]);

  const summary = (
    <div>
      <p className="text-3xl font-semibold">{formatValue(total)}</p>
      <p
        className={cn(
          "text-xs text-muted-foreground",
          change !== null &&
            change.value > 0 &&
            !negativeIncrease &&
            "text-green-500",
          change !== null &&
            change.value > 0 &&
            negativeIncrease &&
            "text-destructive",
          change !== null &&
            change.value < 0 &&
            !negativeIncrease &&
            "text-destructive",
          change !== null &&
            change.value < 0 &&
            negativeIncrease &&
            "text-green-500"
        )}
      >
        {!hideChange &&
          change !== null &&
          `${changeFormatter.format(change.value)}${change.type === "points" ? " pts" : ""} vs previous ${change.window}`}
        {!hideChange && change === null && (
          <Skeleton as="span" className="inline-block h-lh w-[120px]" />
        )}
        {hideChange && change === null && <span className="inline-block" />}
      </p>
    </div>
  );

  const pieChart = hidePieChart ? null : chartData !== null ? (
    <ChartContainer className="aspect-square h-[72px]" config={{}}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="label"
          innerRadius={18}
          animationDuration={150}
        />
      </PieChart>
    </ChartContainer>
  ) : (
    <Skeleton className="aspec-square w-[72px] rounded-full" />
  );

  const servicesBreakdown = Object.entries(values).map(
    ([service, value], index) => {
      return (
        <Fragment key={service}>
          {compact && index !== 0 && (
            <DotIcon className="text-muted-foreground" />
          )}

          <div
            className={cn(
              "items-center gap-2",
              !compact && "mt-1 grid grid-cols-3",
              compact && "inline-flex"
            )}
          >
            <strong
              style={{ color: getServiceColor(service as SupportedService) }}
            >
              {service}
            </strong>
            <span className="col-span-2 text-right">
              {value !== null ? (
                formatValue(value)
              ) : (
                <Skeleton
                  as="span"
                  className={cn("inline-block h-lh w-16", compact && "block")}
                />
              )}
            </span>
          </div>
        </Fragment>
      );
    }
  );

  return (
    <Card {...rest} className={cn("gap-2 overflow-visible", className)}>
      <CardHeader>
        <CardTitle className="text-sm">{heading}</CardTitle>
      </CardHeader>

      <CardContent className="gap-1">
        <div className="flex items-center justify-between gap-1">
          {summary}
          {pieChart}
        </div>
        {compact && (
          <div className="flex items-center gap-1">{servicesBreakdown}</div>
        )}
      </CardContent>

      {(!compact || !!link) && (
        <CardFooter className="block">
          {!compact && servicesBreakdown}

          {link && (
            <Link
              href={link.href}
              className={cn(buttonVariants({ variant: "link" }), "mt-2 px-0")}
            >
              {link.label} <ArrowRightIcon />
            </Link>
          )}
        </CardFooter>
      )}

      {children}
    </Card>
  );
}
