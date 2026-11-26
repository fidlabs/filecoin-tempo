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
import { cacheLife } from "next/cache";
import Link from "next/link";
import { AverageDatasetsPerClientCard } from "./components/average-datasets-per-client-card";
import { ClientsOverTimeCard } from "./components/clients-over-time-card";
import { DatasetsPerClientOverTimeCard } from "./components/datasets-per-client-over-time-card";
import { FundedFilecoinPayWalletsCard } from "./components/funded-filecoin-pay-wallets-card";
import { ReturningClientsCard } from "./components/returning-clients-card";
import { ReturningClientsOverTimeCard } from "./components/returning-clients-over-time-card";
import { TotalClientsCard } from "./components/total-clients-card";
import { ConcentrationOfRevenueCard } from "./components/concentration-of-revenue-card";

export default async function ClientsPage() {
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
                    <BreadcrumbPage>Clients</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div>
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Clients
                </h1>
                <p className="max-w-xl text-muted-foreground">
                  Who is storing data on Filecoin Services.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <HistoryPeriodTabs />
                <ServiceTypeTabs />
                <PeriodChartResolutionInfo />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <TotalClientsCard />
                <AverageDatasetsPerClientCard />
                <ReturningClientsCard />
                <FundedFilecoinPayWalletsCard />
                <ClientsOverTimeCard className="col-span-2" />
                <DatasetsPerClientOverTimeCard className="col-span-2" />
                <ReturningClientsOverTimeCard className="col-span-2" />
                <ConcentrationOfRevenueCard className="col-span-2" />
              </div>
            </Container>
          </main>
        </div>
      </ServiceTypeContextProvider>
    </HistoryPeriodContextProvider>
  );
}
