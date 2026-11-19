import { fetchStorageProvidersHistory } from "@/lib/hyperion";
import { createFetcherHook, QueryKeys } from "@/lib/swr";

export const useStorageProvidersHistory = createFetcherHook(
  fetchStorageProvidersHistory,
  QueryKeys.STORAGE_PROVIDERS_HISTORY
);
