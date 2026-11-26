import z from "zod";
import { createJsonFetcher } from "./data-fetching";
import { createUrlBuilder } from "./url-builder";
import { boolToString } from "./validation";

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
const storageProvidersStatisticsParameters = z.object({
  period: period.optional(),
  service: service.optional(),
});

export type StorageProvidersStatisticsParameters = z.input<
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

const storageProvidersHistoryParameters = z.object({
  period: period.optional(),
  service: service.optional(),
  windowSize: windowSize.optional(),
});
export type StorageProvidersHistoryParameters = z.input<
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

const fcssPaymentsHistoryParameters = z.object({
  windowSize: windowSize.optional(),
  netAmounts: boolToString.optional(),
  providerId: z.string().optional(),
});
export type FcssPaymentsHistoryParameters = z.input<
  typeof fcssPaymentsHistoryParameters
>;

export const fcssPaymentsHistory = z.array(
  z.object({
    date: z.iso.date(),
    volumeUSD: z.number(),
    cumulativeTotalUSD: z.number(),
  })
);
export type FcssPaymentsHistory = z.infer<typeof fcssPaymentsHistory>;

// Fetch methods
export const fetchStorageProvidersStatistics = createJsonFetcher({
  url: createUrlBuilder({
    url: "/storage-providers/statistics",
    base: HYPERION_API_URL,
    searchParamsSchema: storageProvidersStatisticsParameters,
  }),
  schema: storageProvidersStatistics,
  context: context("SPs stats"),
});

export const fetchStorageProvidersHistory = createJsonFetcher({
  url: createUrlBuilder({
    url: "/storage-providers/history",
    base: HYPERION_API_URL,
    searchParamsSchema: storageProvidersHistoryParameters,
  }),
  schema: storageProvidersHistory,
  context: context("SPs history"),
});

export const fetchFcssPaymentsHistory = createJsonFetcher({
  url: createUrlBuilder({
    url: "/po-rep/payments-history",
    base: HYPERION_API_URL,
    searchParamsSchema: fcssPaymentsHistoryParameters,
  }),
  schema: fcssPaymentsHistory,
  context: context("FCSS Payments History"),
});
