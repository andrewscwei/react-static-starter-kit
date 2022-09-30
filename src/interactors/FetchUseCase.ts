import axios, { Method } from 'axios'
import UseCase from './UseCase'

export namespace FetchUseCaseError {
  export const REQUEST_CANCELLED = Error('Request cancelled')
  export const NO_NETWORK = Error('No network or no response from server')
}

/**
 * A {@link UseCase} for fetching data from external API.
 */
export default abstract class FetchUseCase<Params extends Record<string, any>, Result> implements UseCase<Params, Result, never> {

  protected abortController: AbortController | undefined

  /**
   * Method of the fetch request.
   */
  get method(): Lowercase<Method> { return 'get' }

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
    return undefined
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

  async run(params: Partial<Params> = {}): Promise<Result> {
    this.cancel()
    this.abortController = new AbortController()

    this.validateParams(params)

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
      const res = await axios({
        baseURL: host,
        data: useParamsAsData ? transformedParams : undefined,
        headers,
        method,
        params: useParamsAsData ? undefined : transformedParams,
        signal: this.abortController?.signal,
        url: endpoint,
      })

      const transformedPayload = this.transformResult(res.data)

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
