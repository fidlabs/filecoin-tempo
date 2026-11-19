import z from "zod";
import { createJsonFetcher } from "./data-fetching";
import { objectToURLSearchParams } from "./utils";

// Constants
export const HYPERION_API_URL = process.env.NEXT_PUBLIC_HYPERION_API_URL;

// Common
function context(subsection: string): string {
  return `[HYPERION][${subsection}]`;
}

const period = z.enum(["30d", "90d", "1y", "all"]);

const service = z.enum(["fcss", "fwss", "all"]);
export type Service = z.infer<typeof service>;

const windowSize = z.enum(["day", "week", "month"]);
export type WindowSize = z.infer<typeof windowSize>;

const responseServiceKey = z.enum([
  ...service.exclude(["all"]).options,
  "total",
]);
export type ResponseServiceKey = z.infer<typeof responseServiceKey>;

// Schemas

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const storageProvidersStatisticsParameters = z.object({
  period: period.optional(),
  service: service.optional(),
});

export type StorageProvidersStatisticsParmeters = z.infer<
  typeof storageProvidersStatisticsParameters
>;

const storageProvidersStatisticsPeriod = z.intersection(
  z.object({
    periodStart: z.iso.datetime().nullable(),
    periodEnd: z.iso.datetime(),
  }),
  z.record(
    z.enum([
      "totalProvidersCount",
      "activeProvidersCount",
      "earningsUSD",
      "averageSla",
    ]),
    z.record(responseServiceKey, z.number().nullable())
  )
);

const storageProvidersStatistics = z.object({
  period,
  service,
  current: storageProvidersStatisticsPeriod,
  previous: storageProvidersStatisticsPeriod.nullable(),
});
export type StorageProviderStatistics = z.infer<
  typeof storageProvidersStatistics
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const storageProvidersHistoryParameters = z.object({
  period: period.optional(),
  service: service.optional(),
  windowSize: windowSize.optional(),
});

export type StorageProvidersHistoryParameters = z.infer<
  typeof storageProvidersHistoryParameters
>;

const storageProvidersHistory = z.array(
  z.intersection(
    z.object({
      date: z.iso.date(),
    }),
    z.record(
      z.enum([
        "newProvidersCount",
        "totalProvidersCount",
        "activeProvidersCount",
      ]),
      z.record(responseServiceKey, z.number().nullable())
    )
  )
);
export type StorageProvidersHistory = z.infer<typeof storageProvidersHistory>;

// Fetch methods
export const fetchStorageProvidersStatistics = createJsonFetcher({
  url(params: StorageProvidersStatisticsParmeters) {
    return `${HYPERION_API_URL}/storage-providers/statistics?${objectToURLSearchParams(params).toString()}`;
  },
  schema: storageProvidersStatistics,
  context: context("SPs stats"),
});

export const fetchStorageProvidersHistory = createJsonFetcher({
  url(params: StorageProvidersHistoryParameters) {
    return `${HYPERION_API_URL}/storage-providers/history?${objectToURLSearchParams(params).toString()}`;
  },
  schema: storageProvidersHistory,
  context: context("SPs history"),
});
