import { fetchClientsHistory } from "@/lib/hyperion";
import { createFetcherHook, QueryKeys } from "@/lib/swr";

export const useClientsHistory = createFetcherHook(
  fetchClientsHistory,
  QueryKeys.CLIENTS_HISTORY
);
