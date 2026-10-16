import { divideBigInt, formatBigIntSpaced } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export type TokenValueProps = {
  baseUnitName?: string;
  decimals: number;
  symbol: string;
  value: bigint;
};

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
  useGrouping: true,
});

export function TokenValue({
  baseUnitName,
  decimals,
  symbol,
  value,
}: TokenValueProps) {
  const decimalValue = divideBigInt(value, 10n ** BigInt(decimals), decimals);

  return (
    <Tooltip>
      <TooltipTrigger className="tabular-nums underline decoration-dotted underline-offset-4">
        {formatter.format(decimalValue)} {symbol}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="tabular-nums">
          {formatBigIntSpaced(value)} {baseUnitName ?? `${symbol} base units`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
