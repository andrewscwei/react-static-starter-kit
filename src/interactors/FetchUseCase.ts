import axios, { Method } from 'axios'
import objectHash from 'object-hash'
import UseCase from './UseCase'

type CachedResult<Result> = {
  value: Result
  timestamp: number
}

type RunOptions = {
  skipCache?: boolean
}

export namespace FetchUseCaseError {
  export const REQUEST_CANCELLED = Error('Request cancelled')
  export const NO_NETWORK = Error('No network or no response from server')
}

/**
 * A {@link UseCase} for fetching data from external API.
 */
export default abstract class FetchUseCase<Params extends Record<string, any>, Result> implements UseCase<Params, Result, never> {

  protected readonly request = axios.create()

  protected abortController: AbortController | undefined

  /**
   * Method of the fetch request.
   */
  get method(): Lowercase<Method> { return 'get' }

  /**
   * Time to live (TTL) in seconds for the cached result of this use case. If `NaN` or <= 0, caching
   * is disabled.
   */
  get ttl(): number { return 0 }

  /**
   * Optional base URL of the fetch request. If provided, this value will be combined with the
   * return value of {@link getEndpoint} to be used as the request URL. Otherwise, the return value
   * of {@link getEndpoint} alone will be used as the request URL.
   *
   * @param params - The input parameters of this use case.
   */
  getHost(params: Params): string | undefined {
    return undefined
  }

  /**
   * Optional headers to be passed to the request.
   *
   * @params params - The input parameters of this use case.
   */
  getHeaders(params: Params): Record<string, any> | undefined {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    }
  }

  /**
   * Transforms the input parameters of this use case prior to passing them to the request query or
   * body, depending on the request method.
   *
   * @param params - The input parameters of this use case.
   *
   * @returns The transformed parameters to be used to make the request.
   */
  transformParams(params: Params): Record<string, any> {
    return params
  }

  /**
   * Transforms the payload of the response prior to returning it as a result of the execution of
   * this use case.
   *
   * @param payload - The response payload.
   *
   * @returns The transformed result.
   */
  transformResult(payload: any): Result {
    return payload
  }

  /**
   * Transforms any error encountered during the execution of this use case prior to emitting it.
   *
   * @param error - The error.
   *
   * @returns The transformed error.
   */
  transformError(error: unknown): unknown {
    if (axios.isCancel(error)) return FetchUseCaseError.REQUEST_CANCELLED

    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK' || error.response?.status === undefined) return FetchUseCaseError.NO_NETWORK
    }

    return error
  }

  async run(params: Partial<Params> = {}, { skipCache = false }: RunOptions = {}): Promise<Result> {
    this.cancel()
    this.abortController = new AbortController()

    this.validateParams(params)

    const cacheKey = this.ttl > 0 ? this.createCacheKey(params) : undefined

    if (!skipCache && cacheKey) {
      const cachedResult = this.getCachedResult(cacheKey)
      if (cachedResult) return cachedResult
    }

    const endpoint = this.getEndpoint(params)
    const host = this.getHost(params)
    const method = this.method
    const headers = this.getHeaders(params)

    let useParamsAsData: boolean

    switch (method) {
    case 'post':
    case 'put':
    case 'patch':
    case 'delete':
      useParamsAsData = true
      break
    default:
      useParamsAsData = false
    }

    const transformedParams = this.transformParams(params)

    try {
      const res = await this.request({
        baseURL: host,
        data: useParamsAsData ? transformedParams : undefined,
        headers,
        method,
        params: useParamsAsData ? undefined : transformedParams,
        signal: this.abortController?.signal,
        url: endpoint,
      })

      const transformedPayload = this.transformResult(res.data)

      if (cacheKey) {
        this.setCachedResult(cacheKey, transformedPayload)
      }

      return transformedPayload
    }
    catch (err) {
      const error = this.transformError(err)

      throw error
    }
  }

  /**
   * Cancels the execution of this use case.
   */
  cancel() {
    if (this.abortController === undefined) return

    this.abortController.abort()
    this.abortController = undefined
  }

  validateParams(params: Partial<Params>): asserts params is Params {
    // Pass
  }

  private createCacheKey(params: Params): string {
    return objectHash({
      host: this.getHost(params),
      path: this.getEndpoint(params),
      headers: this.getHeaders(params),
      params,
    }, {
      unorderedSets: true,
      unorderedObjects: true,
    })
  }

  private getCachedResult(key: string): Result | undefined {
    const value = window.localStorage.getItem(key)
    if (!value) return undefined

    const cachedResult = JSON.parse(value) as CachedResult<Result>
    if (!cachedResult) return undefined

    const { value: result, timestamp } = cachedResult
    const isStale = (Date.now() - timestamp) / 1000 >= this.ttl

    if (isStale) {
      this.invalidateCache(key)
      return undefined
    }

    return result
  }

  private setCachedResult(key: string, result: Result): CachedResult<Result> {
    const cachedResult = {
      value: result,
      timestamp: Date.now(),
    }

    window.localStorage.setItem(key, JSON.stringify(cachedResult))

    return cachedResult
  }

  private invalidateCache(key: string) {
    window.localStorage.removeItem(key)
  }

  /**
   * Returns the endpoint of this {@link FetchUseCase}. This can be the fully qualified request URL
   * or be combined with the value of {@link getHost} if provided.
   *
   * @param params - The input parameters of this use case.
   *
   * @return The endpoint.
   */
  abstract getEndpoint(params: Params): string
}
