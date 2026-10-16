import { useCallback } from "react";
import useSWR, {
  type SWRConfiguration,
  type SWRResponse,
  unstable_serialize,
} from "swr";
import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteResponse,
} from "swr/infinite";
import type {
  FetcherFn,
  NullaryFetcherFn,
  UnaryFetcherFn,
} from "./data-fetching";

type QueryKey = (typeof queryKeysList)[number];

const queryKeysList = [
  "FPV_INDEXER_STATUS",
  "SERVICE_ORCHESTRATORS",
  "SERVICE_ORCHESTRATOR_CALCULATED_QUARTERLY_VOLUME",
  "SERVICE_ORCHESTRATOR_QUARTERLY_VOLUME_POSTING",
  "GATE_TARGET",
  "FPV_INDEXER_PAYMENTS",
] as const satisfies string[];

export const QueryKeys = Object.fromEntries(
  queryKeysList.map((k) => [k, k] as const)
) as {
  [K in QueryKey]: K;
};

interface PreloadConfig<TE extends boolean> {
  throwErrors?: TE;
}

type PreloadResult<R, TE extends boolean> = [
  string,
  TE extends true ? R : R | undefined,
];

type NullaryFetcherPreloadFn<R, TE extends boolean> = () => Promise<
  PreloadResult<R, TE>
>;
type UnaryFetcherPreloadFn<R, P, TE extends boolean> = (
  parameters: P
) => Promise<PreloadResult<R, TE>>;
type CompositeFetcherKey<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends NullaryFetcherFn<any> | UnaryFetcherFn<any, any>,
> = F extends NullaryFetcherFn<unknown> ? string : [string, Parameters<F>[0]];
type CreateNullaryFetcherHookReturnType<R> = (
  config?: SWRConfiguration<R>
) => SWRResponse<R>;
type CreateUnaryFetcherHookReturnType<R, P> = (
  parameters: P,
  config?: SWRConfiguration<R>
) => SWRResponse<R>;

// Infinite fetcher hook types
type NullaryFetcherInfiniteKeyGenerator<R> = (
  pageIndex: number,
  previousData: R | null
) => string | null;
type UnaryFetcherInfiniteKeyGenerator<R, P> = (
  pageIndex: number,
  previousData: R | null,
  parameters: P
) => [string, P] | null;
type CreateInfiniteNullaryFetcherHookReturnType<R> = (
  config?: SWRInfiniteConfiguration<R>
) => SWRInfiniteResponse<R>;
type CreateInfiniteUnaryFetcherHookReturnType<R, P> = (
  parameters: P,
  config?: SWRInfiniteConfiguration<R>
) => SWRInfiniteResponse<R>;

function createCacheKey(queryKey: string, ...args: unknown[]): string {
  return args.length === 0 ? queryKey : unstable_serialize([queryKey, ...args]);
}

export function createPreloader<R, TE extends boolean>(
  fetcher: NullaryFetcherFn<R>,
  queryKey: string,
  config?: PreloadConfig<TE>
): NullaryFetcherPreloadFn<R, TE>;
export function createPreloader<R, P, TE extends boolean>(
  fetcher: UnaryFetcherFn<R, P>,
  queryKey: string,
  config?: PreloadConfig<TE>
): UnaryFetcherPreloadFn<R, P, TE>;
export function createPreloader<R, P, TE extends boolean>(
  fetcher: NullaryFetcherFn<R> | UnaryFetcherFn<R, P>,
  queryKey: string,
  config?: PreloadConfig<TE>
): NullaryFetcherPreloadFn<R, TE> | UnaryFetcherPreloadFn<R, P, TE> {
  async function preloadInner(parameters?: P): Promise<PreloadResult<R, TE>> {
    const cacheKey = createCacheKey(queryKey, [parameters]);

    try {
      const result = (await fetcher(parameters as P)) as R;
      return [cacheKey, result];
    } catch (error) {
      if (config?.throwErrors) {
        throw error;
      }

      return [cacheKey, undefined as R];
    }
  }

  return preloadInner;
}

function createResolver<R, P>(
  fetcher: FetcherFn<R, P>
): (key: CompositeFetcherKey<FetcherFn<R, P>>) => Promise<R> {
  return function resolver(key) {
    const parameters = fetcher.length === 1 ? key[1] : undefined;
    return fetcher(parameters as P) as Promise<R>;
  };
}

export function createFetcherHook<R>(
  fetcher: NullaryFetcherFn<R>,
  queryKey: string
): CreateNullaryFetcherHookReturnType<R>;
export function createFetcherHook<R, P>(
  fetcher: UnaryFetcherFn<R, P>,
  queryKey: string
): CreateUnaryFetcherHookReturnType<R, P>;
export function createFetcherHook<R, P>(
  fetcher: NullaryFetcherFn<R> | UnaryFetcherFn<R, P>,
  queryKey: string
):
  | CreateNullaryFetcherHookReturnType<R>
  | CreateUnaryFetcherHookReturnType<R, P> {
  return function useFetcher(
    parametersOrConfig?: P | SWRConfiguration<R>,
    maybeConfig?: SWRConfiguration<R>
  ) {
    const parameters =
      fetcher.length === 1 ? (parametersOrConfig as P) : undefined;
    const config =
      fetcher.length === 1
        ? maybeConfig
        : (parametersOrConfig as SWRConfiguration<R>);
    const cacheKey = fetcher.length === 1 ? [queryKey, parameters] : queryKey;
    return useSWR(cacheKey, createResolver(fetcher), config);
  };
}

export function createInfiniteFetcherHook<R>(
  fetcher: NullaryFetcherFn<R>,
  infiniteKeyGenerator: NullaryFetcherInfiniteKeyGenerator<R>
): CreateInfiniteNullaryFetcherHookReturnType<R>;
export function createInfiniteFetcherHook<R, P>(
  fetcher: UnaryFetcherFn<R, P>,
  infiniteKeyGenerator: UnaryFetcherInfiniteKeyGenerator<R, P>
): CreateInfiniteUnaryFetcherHookReturnType<R, P>;
export function createInfiniteFetcherHook<R, P>(
  fetcher: NullaryFetcherFn<R> | UnaryFetcherFn<R, P>,
  infiniteKeyGenerator:
    | NullaryFetcherInfiniteKeyGenerator<R>
    | UnaryFetcherInfiniteKeyGenerator<R, P>
):
  | CreateInfiniteNullaryFetcherHookReturnType<R>
  | CreateInfiniteUnaryFetcherHookReturnType<R, P> {
  return function useInifiniteFetcher(
    parametersOrConfig?: P | SWRInfiniteConfiguration<R>,
    maybeConfig?: SWRInfiniteConfiguration<R>
  ) {
    const parameters =
      fetcher.length === 1 ? (parametersOrConfig as P) : undefined;
    const config =
      fetcher.length === 1
        ? maybeConfig
        : (parametersOrConfig as SWRInfiniteConfiguration<R>);

    const generateKey = useCallback(
      (pageIndex: number, previousData: R | null) => {
        return infiniteKeyGenerator(pageIndex, previousData, parameters as P);
      },
      [parameters]
    );

    return useSWRInfinite(generateKey, createResolver(fetcher), config);
  };
}
