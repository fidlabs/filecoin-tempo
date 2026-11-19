"use client";

import { useQuarterContext } from "@/hooks/use-quarter-context";
import { useCallback, useMemo } from "react";
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
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { ButtonGroup } from "./ui/button-group";

export function QuarterSelector() {
  const { changeQuarter, quarter, quarters } = useQuarterContext();
  const maxQuarter = Math.max(...quarters.map((quarter) => quarter.q));
  const items = useMemo(() => {
    return quarters
      .map((quarter) => {
        return {
          label: `Q${quarter.q}`,
          value: quarter.q,
        } as const;
      })
      .sort((a, b) => b.value - a.value);
  }, [quarters]);

  const prev = useCallback(() => {
    changeQuarter(quarter.q - 1);
  }, [changeQuarter, quarter.q]);

  const next = useCallback(() => {
    changeQuarter(quarter.q + 1);
  }, [changeQuarter, quarter.q]);

  return (
    <ButtonGroup>
      <Button
        size="icon"
        variant="outline"
        disabled={quarter.q === 1}
        onClick={prev}
      >
        <ChevronLeftIcon />
      </Button>
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
      <Button
        size="icon"
        variant="outline"
        disabled={quarter.q === maxQuarter}
        onClick={next}
      >
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  );
}
