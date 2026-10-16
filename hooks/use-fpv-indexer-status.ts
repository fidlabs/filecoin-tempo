import { fetchStatus } from "@/lib/fpv-indexer";
import { createFetcherHook, QueryKeys } from "@/lib/swr";

export const useFpvIndexerStatus = createFetcherHook(
  fetchStatus,
  QueryKeys.FPV_INDEXER_STATUS
);
