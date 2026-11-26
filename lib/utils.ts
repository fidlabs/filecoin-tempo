import { ServiceType } from "@/components/service-type-context";
import { ResponseServiceKey, Service, WindowSize } from "./hyperion";
import { SupportedService } from "./types";
import { HistoryPeriod } from "@/components/history-period-context";

export { cn } from "cn";

export function shortenAddress(input: string): string {
  if (input.length <= 10) {
    return input;
  }

  return input.slice(0, 6) + "..." + input.slice(-4);
}

export function divideBigInt(
  numerator: bigint,
  denominator: bigint,
  precision = 2
): number {
  if (denominator === 0n) {
    return 0;
  }

  const precisionExponent = 10n ** BigInt(precision);
  const numeratorWithPrecision = numerator * precisionExponent;
  const fraction = numeratorWithPrecision / denominator;

  return Number(fraction) / Math.pow(10, precision);
}

export function formatBigIntSpaced(input: bigint) {
  const formatter = new Intl.NumberFormat("en-US", { useGrouping: true });

  return formatter
    .formatToParts(input)
    .map((part) => {
      return part.type === "group" ? " " : part.value;
    })
    .join("");
}

export function objectToURLSearchParams(
  input: Parameters<typeof Object.entries>[0],
  coerce = false
): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    const isValudValue = coerce
      ? typeof value !== "undefined" && value !== null
      : typeof value === "string";

    if (isValudValue && value !== "") {
      params.set(key, String(value));
    }
  });

  return params;
}

export function getServiceColor(service: SupportedService): string {
  switch (service) {
    case "FCSS":
      return "#7EA2FF";
    case "FWSS":
      return "#C25200";
  }
}

export function serviceToHyperionService(service: ServiceType): Service {
  switch (service) {
    case "FCSS":
      return "fcss";
    case "FWSS":
      return "fwss";
    case "all":
      return "all";
  }
}

export function serviceToHyperionResponseServiceKey(
  service: ServiceType
): ResponseServiceKey {
  switch (service) {
    case "FCSS":
      return "fcss";
    case "FWSS":
      return "fwss";
    case "all":
      return "total";
  }
}

export function periodToHyperionWindowSize(period: HistoryPeriod): WindowSize {
  switch (period) {
    case "30d":
    case "90d":
      return "day";
    case "1y":
      return "week";
    default:
      return "month";
  }
}

export function createChartDateFormatter({
  weekDisplay = "range",
  windowSize,
}: {
  weekDisplay?: "start" | "range";
  windowSize: "day" | "week" | "month";
}) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: windowSize === "month" ? "2-digit" : undefined,
    month: "short",
    day: windowSize === "month" ? undefined : "numeric",
  });

  function formatDate(input: unknown) {
    if (typeof input !== "string" && !(input instanceof Date)) {
      return String(input);
    }

    const date = new Date(input);
    if (windowSize === "week" && weekDisplay === "range") {
      const nextWeek = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      return formatter.formatRange(date, nextWeek);
    }

    return formatter.format(date);
  }

  return formatDate;
}
