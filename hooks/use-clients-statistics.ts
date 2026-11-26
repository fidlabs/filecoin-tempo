import { fetchClientsStatistics } from "@/lib/hyperion";
import { createFetcherHook, QueryKeys } from "@/lib/swr";

export const useClientsStatistics = createFetcherHook(
  fetchClientsStatistics,
  QueryKeys.CLIENTS_STATISTICS
);
