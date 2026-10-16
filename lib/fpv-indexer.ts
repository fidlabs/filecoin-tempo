import z from "zod";
import { createJsonFetcher } from "./data-fetching";
import { objectToURLSearchParams } from "./utils";

export type SortKey<T extends string> = T extends `${"+" | "-"}${string}`
  ? T
  : T | `+${T}` | `-${T}`;

export const FPV_INDEXER_API_URL = process.env.NEXT_PUBLIC_FPV_INDEXER_API_URL;

if (typeof FPV_INDEXER_API_URL !== "string") {
  throw new TypeError("FPV Indexer API URL not defined in enviroment.");
}

// Common
const uint = z.coerce.bigint().min(0n);
const epoch = uint;
const quarterNumberInt = z.number().int().min(1);

// Schemas
const paginationMetadataSchema = z.object({
  pagination: z.object({
    page: z.number().int().min(1),
    pagesCount: z.coerce.bigint().min(1n),
    totalCount: z.coerce.bigint().min(0n),
  }),
});

const statusSchema = z.object({
  version: z.string(),
  chainId: z.number(),
  indexedUpTo: epoch,
  isRunning: z.boolean(),
  contracts: z.array(
    z.object({
      type: z.enum(["SRA", "SWA", "FilecoinPayV1", "ERC20"]),
      address: z.string(),
      indexedUpTo: epoch,
    })
  ),
});
export type Status = z.infer<typeof statusSchema>;

const quarterSchema = z.object({
  q: z.number().int().min(1),
  startEpoch: epoch,
  endEpoch: epoch,
  completed: z.boolean(),
});
export type Quarter = z.infer<typeof quarterSchema>;

const quartersListSchema = z.array(quarterSchema);
export type QuartersList = z.infer<typeof quartersListSchema>;

const serviceOrchestratorAdmissionSchema = z.object({
  wallet: z.string(),
  admissionEpoch: epoch,
  admissionLogIndex: z.number(),
  admissionTxHash: z.string(),
  removalEpoch: epoch.nullable(),
  removalLogIndex: z.number().nullable(),
  removalTxHash: z.string().nullable(),
});

const serviceOrchestratorSchema = z.object({
  id: z.string(),
  admissionPeriods: z.array(serviceOrchestratorAdmissionSchema),
});
export type ServiceOrchestrator = z.infer<typeof serviceOrchestratorSchema>;

const serviceOrchestratorsListSchema = z.array(serviceOrchestratorSchema);
export type ServiceOrchestratorsList = z.infer<
  typeof serviceOrchestratorsListSchema
>;

const quarterlyVolumeSchema = z.object({
  quarter: quarterSchema,
  volumeAttoUsd: uint,
  volumeUsd: z.number(),
  filVolumeAttoUsd: uint,
  filVolumeUsd: z.number(),
  stablecoinVolumeAttoUsd: uint,
  stablecoinVolumeUsd: z.number(),
  pricingPeriods: z.array(
    z.object({
      startEpoch: epoch,
      startLogIndex: z.number(),
      endEpoch: epoch,
      endLogIndex: z.number(),
      lotAttoUsd: uint,
      lotUsd: z.number(),
      claimAttoFil: uint,
      claimFil: z.number(),
      volumeAttoFil: uint,
      volumeFil: z.number(),
      volumeAttoUsd: uint,
      volumeUsd: z.number(),
      impliedRate: z.coerce.number(),
    })
  ),
});
export type QuarterlyVolume = z.infer<typeof quarterlyVolumeSchema>;

const volumePostingOrCorrectionSchema = z.object({
  serviceOrchestrator: z.string(),
  volumeAttoUsd: uint,
  correction: z.boolean(),
  postingEpoch: epoch,
  postingTxHash: z.string(),
});

const quarterlyVolumePostingsSchema = z.object({
  quarterNumber: quarterNumberInt,
  aggregatedVolumeAttoUsd: uint,
  postings: z.array(volumePostingOrCorrectionSchema),
});
export type QuarterlyVolumePostings = z.infer<
  typeof quarterlyVolumePostingsSchema
>;

const serviceOrchestratorQuarterlyVolumePostingSchema = z.object({
  serviceOrchestrator: z.string(),
  quarterNum: z.number(),
  volumeAttoUsd: uint.nullable(),
  corrected: z.boolean(),
  missed: z.boolean(),
  postingEpoch: epoch.nullable(),
  postingTxHash: z.string().nullable(),
  postings: z.array(volumePostingOrCorrectionSchema),
});
export type ServiceOrchestratorQuarterlyVolumePostingSchema = z.infer<
  typeof serviceOrchestratorQuarterlyVolumePostingSchema
>;

const gateTargetSchema = z.object({
  atEpoch: epoch.nullable(),
  lastCheckEpoch: epoch.nullable(),
  capReached: z.boolean(),
  targetAttoUsd: uint,
  targetUsd: z.number(),
});
export type GateTarget = z.infer<typeof gateTargetSchema>;

export const pricingPeriodSchema = z.object({
  auctionTransactionHash: z.string(),
  startEpoch: epoch,
  startLogIndex: z.number(),
  endEpoch: epoch,
  endLogIndex: z.number(),
  lotAttoUsd: uint,
  lotUsd: z.number(),
  claimAttoFil: uint,
  claimFil: z.number(),
  impliedRate: z.number().min(0),
});

const paymentSchema = z.object({
  filecoinPayContract: z.string(),
  logIndex: z.number(),
  transactionHash: z.string(),
  epoch: epoch,
  railId: uint,
  payer: z.string(),
  payee: z.string(),
  operator: z.string(),
  tokenAddress: z.string(),
  tokenDecimals: z.number(),
  tokenSymbol: z.string(),
  totalAmountBaseUnits: uint,
  totalAmount: z.number(),
  netPayeeAmountBaseUnits: uint,
  netPayeeAmount: z.number(),
  networkFeeBaseUnits: uint,
  networkFee: z.number(),
  operatorComissionBaseUnits: uint,
  operatorComission: z.number(),
  serviceOrchestrator: z.string().nullable(),
  filecoinPayContractWhitelisted: z.boolean(),
  tokenWhitelisted: z.boolean(),
  quarter: quarterSchema.nullable(),
  pricingPeriod: pricingPeriodSchema.nullable(),
});
export type Payment = z.infer<typeof paymentSchema>;

const paginatedPaymentsListSchema = paginationMetadataSchema.extend({
  data: z.array(paymentSchema),
});
export type PaginatedPaymentsList = z.infer<typeof paginatedPaymentsListSchema>;

// Fetch methods
export const fetchStatus = createJsonFetcher({
  url: `${FPV_INDEXER_API_URL}/status`,
  schema: statusSchema,
  context: "[FPV Indexer][Status]",
});

export const fetchQuarters = createJsonFetcher({
  url: `${FPV_INDEXER_API_URL}/quarters`,
  schema: quartersListSchema,
  context: "[FPV Indexer][Quarters List]",
});

export const fetchServiceOrchestrators = createJsonFetcher({
  url: `${FPV_INDEXER_API_URL}/service-orchestrators`,
  schema: serviceOrchestratorsListSchema,
  context: "[FPV Indexer][Service Orchestrators List]",
});

export interface QuarterlyVolumeParameters {
  quarterNumber: number | `Q${number}`;
}

export const fetchQuarterlyVolume = createJsonFetcher({
  url({ quarterNumber }: QuarterlyVolumeParameters) {
    return `${FPV_INDEXER_API_URL}/volume/${quarterNumber}`;
  },
  schema: quarterlyVolumeSchema,
  context: "[FPV Indexer][Total Quarterly Volume]",
});

export interface QuarterlyVolumePostingsParameters {
  quarterNumber: number | `Q${number}`;
}

export const fetchQuarterlyVolumePostings = createJsonFetcher({
  url({ quarterNumber }: QuarterlyVolumePostingsParameters) {
    return `${FPV_INDEXER_API_URL}/quarters/${quarterNumber}/postings`;
  },
  schema: quarterlyVolumePostingsSchema,
  context: "[FPV Indexer][Quarterly Volume Postings]",
});

export interface ServiceOrchestratorQuarterlyVolumeParameters {
  quarterNumber: number | `Q${number}`;
  serviceOrchestrator: string;
}

export const fetchServiceOrchestratorQuarterlyVolume = createJsonFetcher({
  url({
    quarterNumber,
    serviceOrchestrator,
  }: ServiceOrchestratorQuarterlyVolumeParameters) {
    return `${FPV_INDEXER_API_URL}/volume/${quarterNumber}/${serviceOrchestrator}`;
  },
  schema: quarterlyVolumeSchema,
  context: "[FPV Indexer][Service Orchestrator Quarterly Volume]",
});

export interface ServiceOrchestratorQuarterlyVolumePostingParameters {
  quarterNumber: number | `Q${number}`;
  serviceOrchestrator: string;
}

export const fetchServiceOrchestratorQuarterlyVolumePosting = createJsonFetcher(
  {
    url({
      quarterNumber,
      serviceOrchestrator,
    }: ServiceOrchestratorQuarterlyVolumePostingParameters) {
      return `${FPV_INDEXER_API_URL}/quarters/${quarterNumber}/postings/${serviceOrchestrator}`;
    },
    schema: serviceOrchestratorQuarterlyVolumePostingSchema,
    context: "[FPV Indexer][Service Orchestrator Quarterly Volume Posting]",
  }
);

export interface GateTargetParameters {
  atEpoch?: bigint;
}

export const fetchGateTarget = createJsonFetcher({
  url(params: GateTargetParameters) {
    return `${FPV_INDEXER_API_URL}/gate/target?${objectToURLSearchParams(params, true)}`;
  },
  schema: gateTargetSchema,
  context: "[FPV Indexer][Gate Target]",
});

export interface PaymentsListParameters {
  serviceOrchestrator?: string;
  fromEpoch?: bigint | number | string;
  toEpoch?: bigint | number | string;
  countsTowardsVolume?: boolean;
  sort?: SortKey<"epoch">;
  page?: number;
  limit?: number;
}

export const fetchPaymentsList = createJsonFetcher({
  url(params: PaymentsListParameters) {
    return `${FPV_INDEXER_API_URL}/payments?${objectToURLSearchParams(params, true)}`;
  },
  schema: paginatedPaymentsListSchema,
  context: "[FPV Indexer][Payments List]",
});

// Utils
export function wasOrchestratorActiveInQuarter({
  admissionPeriods,
  quarterBoundaries,
}: {
  admissionPeriods: ServiceOrchestrator["admissionPeriods"];
  quarterBoundaries: Pick<Quarter, "startEpoch" | "endEpoch">;
}): boolean {
  return admissionPeriods.some((period) => {
    const admittedBeforeQEnd =
      period.admissionEpoch <= quarterBoundaries.endEpoch;
    const notRemovedBeforeQStart =
      period.removalEpoch === null ||
      period.removalEpoch >= quarterBoundaries.startEpoch;

    return admittedBeforeQEnd && notRemovedBeforeQStart;
  });
}
