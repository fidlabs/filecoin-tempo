"use cache";

import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { HistoryPeriodContextProvider } from "@/components/history-period-context";
import { HistoryPeriodTabs } from "@/components/history-period-tabs";
import { PeriodChartResolutionInfo } from "@/components/period-chart-resolution-info";
import { ServiceTypeContextProvider } from "@/components/service-type-context";
import { ServiceTypeTabs } from "@/components/service-type-tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { supportedServices } from "@/lib/constants";
import { last } from "es-toolkit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { TotalProvidersCard } from "./components/total-providers-card";
import { ActiveProvidersCard } from "./components/active-providers-card";
import { EarningsCard } from "./components/earnings-card";
import { AverageSlaCard } from "./components/average-sla-card";
import { ProvidersOverTimeCard } from "./components/providers-over-time-card";
import { ActiveProvidersOverTimeCard } from "./components/active-providers-over-time-card";

export default async function RootPage() {
  cacheLife("minutes");

  return (
    <HistoryPeriodContextProvider>
      <ServiceTypeContextProvider>
        <div className="min-h-svh">
          <Header />

          <main>
            <Container className="flex flex-col gap-8 pt-8 pb-16">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href="/" />}>
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Storage Providers</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Storage Providers
                </h1>
                <p className="max-w-xl text-muted-foreground">
                  Providers counts, earnings and SLA across{" "}
                  {createServicesString(supportedServices)}.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <HistoryPeriodTabs />
                <ServiceTypeTabs />
                <PeriodChartResolutionInfo />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <TotalProvidersCard />
                <ActiveProvidersCard />
                <EarningsCard />
                <AverageSlaCard />
                <ProvidersOverTimeCard className="md:col-span-2" />
                <ActiveProvidersOverTimeCard className="md:col-span-2" />
              </div>
            </Container>
          </main>
        </div>
      </ServiceTypeContextProvider>
    </HistoryPeriodContextProvider>
  );
}

function createServicesString(input: string[]): string {
  if (input.length > 1) {
    return input.slice(0, -1).join(", ") + " and " + last(input);
  }

  return input[0];
}
