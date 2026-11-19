import {
  ServiceTypeContext,
  ServiceTypeContextShape,
} from "@/components/service-type-context";
import { useContext } from "react";

export function useServiceTypeContext(): ServiceTypeContextShape {
  const context = useContext(ServiceTypeContext);

  if (context === undefined) {
    throw new TypeError(
      "useServiceTypeContext must be used within ServiceTypeContextProvider"
    );
  }

  return context;
}
