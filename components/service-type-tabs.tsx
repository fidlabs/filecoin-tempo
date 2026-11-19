"use client";

import { useServiceTypeContext } from "@/hooks/use-service-type-context";
import { ServiceType } from "./service-type-context";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { getServiceColor } from "@/lib/utils";

function serviceTypeLabel(serviceType: ServiceType): string {
  switch (serviceType) {
    case "all":
      return "All Services";
    default:
      return serviceType;
  }
}

export function ServiceTypeTabs() {
  const { serviceType, availableServiceTypes, setServiceType } =
    useServiceTypeContext();

  return (
    <Tabs value={serviceType} onValueChange={setServiceType}>
      <TabsList>
        {availableServiceTypes.map((serviceType) => (
          <TabsTrigger
            key={serviceType}
            value={serviceType}
            style={{
              color:
                serviceType !== "all"
                  ? getServiceColor(serviceType)
                  : undefined,
            }}
          >
            {serviceTypeLabel(serviceType)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
