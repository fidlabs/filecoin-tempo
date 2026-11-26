import type { ZodType } from "zod";

interface StaticUrlBuilderConfig {
  base?: string | URL;
  url: string;
  searchParamsSchema?: never;
}

interface ParametrizedUrlBuilderConfig<P> {
  base?: string | URL;
  url: string | ((parameters: P) => string);
  searchParamsSchema?: ZodType<Record<string, string>, P>;
}

export function buildUrl(config: StaticUrlBuilderConfig): URL;
export function buildUrl<P>(
  config: ParametrizedUrlBuilderConfig<P>,
  parameters: P
): URL;
export function buildUrl<P>(
  config: StaticUrlBuilderConfig | ParametrizedUrlBuilderConfig<P>,
  parameters?: P
): URL {
  const url =
    typeof config.url === "function" ? config.url(parameters as P) : config.url;
  const result = new URL(url, config.base);

  if (config.searchParamsSchema) {
    const searchParams = new URLSearchParams(
      config.searchParamsSchema.decode(parameters as P)
    );
    result.search = searchParams.toString();
  }

  return result;
}

export function createUrlBuilder(config: StaticUrlBuilderConfig): () => URL;
export function createUrlBuilder<P>(
  config: ParametrizedUrlBuilderConfig<P>
): (parameters: P) => URL;
export function createUrlBuilder<P>(
  config: StaticUrlBuilderConfig | ParametrizedUrlBuilderConfig<P>
) {
  function buildUrlInner(parameters: P) {
    return buildUrl(config, parameters);
  }

  return buildUrlInner;
}
