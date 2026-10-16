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
