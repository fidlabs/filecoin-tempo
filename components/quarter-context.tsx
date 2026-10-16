"use client";

import type { Quarter } from "@/lib/fpv-indexer";
import { last } from "es-toolkit";
import { createParser, useQueryState } from "nuqs";
import { createContext, PropsWithChildren, ReactNode, useMemo } from "react";

export type QuarterContextShape = {
  quarter: Quarter;
  quarters: Quarter[];
  changeQuarter(quarterNumber: number | null): void;
};

export type QuarterContextProviderProps = PropsWithChildren<{
  fallback: ReactNode | (() => ReactNode);
  quarters: Quarter[];
}>;

export const QuarterContext = createContext<QuarterContextShape>({
  quarter: { q: 1, startEpoch: 0n, endEpoch: 0n, completed: false },
  quarters: [],
  changeQuarter() {},
});

export function QuarterContextProvider({
  children,
  fallback,
  quarters,
}: QuarterContextProviderProps) {
  const fallbackElement = useMemo(() => {
    return typeof fallback === "function" ? fallback() : fallback;
  }, [fallback]);

  const parseAsQuarterNumber = useMemo(() => {
    return createParser({
      parse(value) {
        try {
          const intValue = parseInt(value, 10);
          const isValid = quarters.some((quarter) => quarter.q === intValue);
          return isValid ? intValue : null;
        } catch {
          return null;
        }
      },
      serialize(value) {
        return value.toString();
      },
    });
  }, [quarters]);

  const lastQuarter = last(quarters);
  const [quarterNumber, setQuarterNumber] = useQueryState(
    "q",
    parseAsQuarterNumber.withDefault(lastQuarter ? lastQuarter.q : 1)
  );
  const quarter = quarters.find((candidate) => candidate.q === quarterNumber);

  if (quarters.length === 0 || !quarter) {
    return fallbackElement;
  }

  return (
    <QuarterContext.Provider
      value={{
        quarter,
        quarters,
        changeQuarter: setQuarterNumber,
      }}
    >
      {children}
    </QuarterContext.Provider>
  );
}
