"use client";

import { supportedServices } from "@/lib/constants";
import { type SupportedService } from "@/lib/types";
import { cn, getServiceColor } from "@/lib/utils";
import { DotIcon } from "lucide-react";
import {
  Fragment,
  HTMLAttributes,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardTitle } from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Skeleton } from "./ui/skeleton";

export type ServiceKpiCardProps = ComponentProps<typeof Card>;

function safeGetNumberSign(input: unknown): "+" | "-" | null {
  if (typeof input !== "number" || input === 0) return null;
  return input > 0 ? "+" : "-";
}

export function ServiceKpiCard({
  children,
  className,
  ...rest
}: ServiceKpiCardProps) {
  return (
    <Card {...rest} className={cn("gap-2 overflow-visible", className)}>
      {children}
    </Card>
  );
}

export type ServiceKpiCardHeadingProps = ComponentProps<typeof CardTitle>;

export function ServiceKpiCardHeading({
  children,
  className,
  ...rest
}: ServiceKpiCardHeadingProps) {
  return (
    <CardTitle {...rest} className={cn("text-sm", className)}>
      {children}
    </CardTitle>
  );
}

export type ServiceKpiCardValueProps = HTMLAttributes<HTMLParagraphElement>;

export function ServiceKpiCardValue({
  children,
  className,
  ...rest
}: ServiceKpiCardValueProps) {
  return (
    <p {...rest} className={cn("text-3xl font-semibold", className)}>
      {children ?? <Skeleton as="span" className="h-lh w-[120px]" />}
    </p>
  );
}

export type ServiceKpiCardChangeProps = Omit<
  HTMLAttributes<HTMLParagraphElement>,
  "children"
> & {
  change: {
    type: "percent" | "points";
    value: number | null;
    window: string;
  } | null;
  negativeIncrease?: boolean;
};

export function ServiceKpiCardChange({
  change,
  className,
  negativeIncrease = false,
  ...rest
}: ServiceKpiCardChangeProps) {
  const changeFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: change?.type === "points" ? "decimal" : "percent",
      signDisplay: "always",
      maximumFractionDigits: 2,
      minimumFractionDigits: 1,
    });
  }, [change?.type]);

  const sign = safeGetNumberSign(change?.value);
  const positive =
    sign !== null && negativeIncrease ? sign === "-" : sign === "+";
  const negative =
    sign !== null && negativeIncrease ? sign === "+" : sign === "-";

  return (
    <p
      {...rest}
      className={cn(
        "text-xs text-muted-foreground",
        positive && "text-green-500",
        negative && "text-destructive",
        className
      )}
    >
      {change !== null &&
        change.value !== null &&
        `${changeFormatter.format(change.value)}${change.type === "points" ? " pts" : ""} vs previous ${change.window}`}

      {change !== null && change.value === null && (
        <span className="inline-block" />
      )}

      {change === null && (
        <Skeleton as="span" className="inline-block h-lh w-[120px]" />
      )}
    </p>
  );
}

export type ServiceKpiCardPieChartProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  values: Record<SupportedService, number | null> | null | undefined;
};

export function ServiceKpiCardPieChart({
  className,
  values,
  ...rest
}: ServiceKpiCardPieChartProps) {
  type ChartEntry = {
    label: string;
    value: number;
    fill: string;
  };

  const chartData = useMemo(() => {
    if (!values) return [];

    const entries = Object.entries(values).flatMap(([service, value]) => {
      if (value === null) return [];

      const entry = {
        label: service,
        value,
        fill: getServiceColor(service as SupportedService),
      } satisfies ChartEntry;

      return [entry];
    });

    return entries as ChartEntry[];
  }, [values]);

  return (
    <div {...rest} className={cn("aspect-square h-[72px]", className)}>
      {values ? (
        <ChartContainer className="h-full w-full" config={{}}>
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
        <Skeleton className="h-full w-full rounded-full" />
      )}
    </div>
  );
}

export type ServiceKpiCardContentProps = ComponentProps<typeof CardContent>;

export function ServiceKpiCardContent({
  children,
  className,
  ...rest
}: ServiceKpiCardContentProps) {
  return (
    <CardContent {...rest} className={cn("gap-1", className)}>
      {children}
    </CardContent>
  );
}

export type ServiceKpiCardBreakdownProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  compact?: boolean;
  values: Record<SupportedService, ReactNode> | null | undefined;
};

export function ServiceKpiCardBreakdown({
  className,
  compact,
  values,
  ...rest
}: ServiceKpiCardBreakdownProps) {
  const parts = supportedServices.map((service, index) => {
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
            {values ? (
              values[service]
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
  });

  return (
    <div
      {...rest}
      className={cn(compact && "flex items-center gap-1", className)}
    >
      {parts}
    </div>
  );
}
