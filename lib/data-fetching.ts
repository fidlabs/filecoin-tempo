import { type ZodType } from "zod";
import { throwHTTPErrorOrSkip } from "./http-errors";
import { parseSchema } from "./validation";

export type NullaryFetcherFn<R> = () => Promise<R>;
export type UnaryFetcherFn<R, P> = (parameters: P) => Promise<R>;
export type FetcherFn<R, P> = NullaryFetcherFn<R> | UnaryFetcherFn<R, P>;

export type UrlGenerator<P> = (parameters: P) => string;

interface BaseJsonFetcherOptions<R> {
  schema: ZodType<R>;
  context?: string;
}

interface NonParametrizedJsonFetcherOptions<
  R,
> extends BaseJsonFetcherOptions<R> {
  url: string;
}

interface ParametrizedJsonFetcherOptions<
  R,
  P,
> extends BaseJsonFetcherOptions<R> {
  url: UrlGenerator<P>;
}

export function createJsonFetcher<R>(
  options: NonParametrizedJsonFetcherOptions<R>
): NullaryFetcherFn<R>;
export function createJsonFetcher<R, P>(
  options: ParametrizedJsonFetcherOptions<R, P>
): UnaryFetcherFn<R, P>;
export function createJsonFetcher<R, P>(
  options:
    NonParametrizedJsonFetcherOptions<R> | ParametrizedJsonFetcherOptions<R, P>
): NullaryFetcherFn<R> | UnaryFetcherFn<R, P> {
  const contextPrefix = options.context ? options.context + " " : "";

  async function fetcher(parameters: P): Promise<R> {
    const url =
      typeof options.url === "string" ? options.url : options.url(parameters);
    const response = await fetch(url);

    throwHTTPErrorOrSkip(
      response,
      `${contextPrefix}Fetch resulted in HTTP status ${response.status}; URL: ${url}`
    );

    const json = await response.json();
    const data = parseSchema(
      json,
      options.schema,
      `${contextPrefix}Invalid response returned; URL: ${url}`
    );

    return data;
  }

  return fetcher;
}
