"use client";

import { useQuarterContext } from "@/hooks/use-quarter-context";
import { useMemo } from "react";
import { Button } from "./ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "./ui/combobox";
import { ChevronDownIcon } from "lucide-react";

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
    <Combobox items={items} value={quarter.q} onValueChange={changeQuarter}>
      <ComboboxTrigger
        disabled={quarters.length === 0}
        render={
          <Button
            className="w-18 justify-between font-normal"
            variant="outline"
          >
            <ComboboxValue />
            <ChevronDownIcon />
          </Button>
        }
      />
      <ComboboxContent>
        <ComboboxInput showTrigger={false} placeholder="Search" />
        <ComboboxEmpty>No matching quarters found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
