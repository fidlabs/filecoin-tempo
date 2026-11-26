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
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { supportedServices } from "@/lib/constants";
import { last } from "es-toolkit";
import { SparklesIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";

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
                    <BreadcrumbPage>Home</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Filecoin Services
                </h1>
                <p className="max-w-xl text-muted-foreground">
                  Network totals across{" "}
                  {createServicesString(supportedServices)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <HistoryPeriodTabs />
                <ServiceTypeTabs />
                <PeriodChartResolutionInfo />
              </div>

              <Empty className="pt-24">
                <EmptyHeader>
                  <SparklesIcon className="mb-6 text-yellow-500" size={36} />
                  <EmptyTitle>Exciting things are coming soon!</EmptyTitle>
                  <EmptyDescription>
                    For now why don&apos;t you try the new{" "}
                    <Link href="/clients">Clients Tab</Link>?
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
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
