"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuarterContext } from "@/hooks/use-quarter-context";
import { useMemo } from "react";

export function QuarterSelector() {
  const { changeQuarter, quarter, quarters } = useQuarterContext();
  const items = useMemo(() => {
    return quarters.map((quarter) => {
      return {
        label: `Q${quarter.q}`,
        value: quarter.q,
      } as const;
    });
  }, [quarters]);

  return (
    <Select
      disabled={quarters.length === 0}
      items={items}
      value={quarter.q}
      onValueChange={changeQuarter}
    >
      <SelectTrigger aria-label="Select quarter" className="w-18">
        <SelectValue placeholder="Select quarter" />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
