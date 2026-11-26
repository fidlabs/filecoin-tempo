"use client";

import { supportedServices } from "@/lib/constants";
import { SupportedService } from "@/lib/types";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { createContext, PropsWithChildren } from "react";

export type ServiceType = SupportedService | "all";

export type ServiceTypeContextShape = {
  availableServiceTypes: readonly ServiceType[];
  serviceType: ServiceType;
  setServiceType(historyPeriod: ServiceType): void;
};

export const ServiceTypeContext = createContext<ServiceTypeContextShape>({
  availableServiceTypes: supportedServices,
  serviceType: "all",
  setServiceType() {},
});

export function ServiceTypeContextProvider({ children }: PropsWithChildren) {
  const [serviceType, setServiceType] = useQueryState(
    "service",
    parseAsStringEnum(["all", ...supportedServices]).withDefault("FCSS")
  );

  return (
    <ServiceTypeContext.Provider
      value={{
        availableServiceTypes: ["all", ...supportedServices],
        serviceType,
        setServiceType,
      }}
    >
      {children}
    </ServiceTypeContext.Provider>
  );
}
