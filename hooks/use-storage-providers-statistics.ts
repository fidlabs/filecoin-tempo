import { fetchStorageProvidersStatistics } from "@/lib/hyperion";
import { createFetcherHook, QueryKeys } from "@/lib/swr";

export const useStorageProvidersStatistics = createFetcherHook(
  fetchStorageProvidersStatistics,
  QueryKeys.STORAGE_PROVIDERS_STATISTICS
);
