import { Container } from "@/components/container";
import { ExplorerActionsMenu } from "@/components/explorer-actions-menu";
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
import { fetchQuarters, fetchServiceOrchestrators } from "@/lib/fpv-indexer";
import { objectToURLSearchParams, shortenAddress } from "@/lib/utils";
import { pick } from "es-toolkit";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type SearchParams } from "nuqs/server";
import { CalculatedQuarterlyVolume } from "./components/calculated-quarterly-volume";
import { PaymentsTable } from "./components/payments-table";
import { PostedQuarterlyVolume } from "./components/posted-quarterly-volume";
import { AdmissionGate } from "./components/admission-gate";
import { cacheLife } from "next/cache";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: SearchParams;
};

export const instant = false;

async function fetchData() {
  "use cache";

  cacheLife("minutes");

  return Promise.all([fetchServiceOrchestrators(), fetchQuarters()]);
}

export default async function ServiceOrchestratorDetailsPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Props) {
  const [{ id }, searchParams] = await Promise.all([
    paramsPromise,
    searchParamsPromise,
  ]);
  const [orchestrators, quarters] = await fetchData();
  const orchestrator = orchestrators.find(
    (o) => o.id.toLowerCase() === id.toLowerCase()
  );

  if (!orchestrator) {
    redirect("/404");
  }

  const passedSearchParams = objectToURLSearchParams(pick(searchParams, ["q"]));

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
        <Header extras={[<QuarterSelector key="quarters-selector" />]} />
        <main>
          <Container className="flex flex-col gap-4 pt-8 pb-16">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/" />}>
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    render={
                      <Link
                        href={`/service-orchestrators?${passedSearchParams.toString()}`}
                      />
                    }
                  >
                    Service Orchestrators
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{shortenAddress(id)}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <AdmissionGate admissionPeriods={orchestrator.admissionPeriods}>
              <div className="mb-4">
                <div className="flex items-center gap-x-2">
                  <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                    {shortenAddress(id)}
                  </h1>
                  <ExplorerActionsMenu
                    variant="address"
                    input={id}
                    triggerButtonSize="icon-lg"
                  />
                </div>
                <p className="max-w-xl text-muted-foreground">
                  Service Orchestrator Details.
                </p>
              </div>

              <div className="mb-6 grid gap-x-4 gap-y-2 md:grid-cols-2">
                <CalculatedQuarterlyVolume serviceOrchestrator={id} />
                <PostedQuarterlyVolume serviceOrchestrator={id} />
              </div>

              <PaymentsTable serviceOrchestrator={id} />
            </AdmissionGate>
          </Container>
        </main>
      </div>
    </QuarterContextProvider>
  );
}
