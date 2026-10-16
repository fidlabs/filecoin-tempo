import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { QuarterContextProvider } from "@/components/quarter-context";
import { QuarterSelector } from "@/components/quarter-selector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchQuarters } from "@/lib/fpv-indexer";
import Link from "next/link";
import { AggregatedVolumeWidget } from "./components/aggregated-volume-widget";
import { ServiceOrchestratorsTable } from "./components/service-orchestrators-table";

export default async function ServiceOrchestratorsPage() {
  const quarters = await fetchQuarters();

  return (
    <QuarterContextProvider
      quarters={quarters}
      fallback={
        <div className="min-h-svh">
          <Header />
          <main>
            <Container>
              <p className="text-center text-muted-foreground">
                Nothing to show. Q1 has not started yet.
              </p>
            </Container>
          </main>
        </div>
      }
    >
      <div className="min-h-svh">
        <Header extras={[<QuarterSelector key="quarter-selector" />]} />

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
                  <BreadcrumbPage>Service Orchestrators</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Service Orchestrators.
              </h1>
              <p className="max-w-xl text-muted-foreground">
                Browse Service Orchestrators and their Filecoin Pay volume.
              </p>
            </div>

            <AggregatedVolumeWidget />
            <ServiceOrchestratorsTable />
          </Container>
        </main>
      </div>
    </QuarterContextProvider>
  );
}
