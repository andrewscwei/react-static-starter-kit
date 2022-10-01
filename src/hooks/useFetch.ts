import { useEffect, useMemo, useRef, useState } from 'react'
import FetchUseCase, { FetchUseCaseError } from '../interactors/FetchUseCase'
import Interactor from '../interactors/Interactor'
import useDebug from '../utils/useDebug'

const debug = useDebug('fetch')

type Options<T> = {

  /**
   * Specifies if cache should be skipped.
   */
  skipCache?: boolean

  /**
   * Handler invoked when the use case cancels running.
   */
  onCancel?: () => void

  /**
   * Handler invoked when the use case fails while running.
   *
   * @param error - The error encountered while running the use case.
   */
  onError?: (error: Error) => void

  /**
   * Handler invoked when the use case runs successfully.
   *
   * @param result - The result of the successful use case interaction.
   */
  onSuccess?: (result: T) => void
}

/**
 * Hook for interacting with a {@link FetchUseCase}.
 *
 * @param UseCaseClass - The {@link FetchUseCase} class to interact with.
 * @param options - @see {@link Options}.
 *
 * @returns The {@link Interactor}.
 */
export default function useFetch<Params extends Record<string, any>, Result>(
  UseCaseClass: new () => FetchUseCase<Params, Result>,
  {
    skipCache = false,
    onCancel,
    onError,
    onSuccess,
  }: Options<Result> = {},
): Interactor<Params, Result> {
  const totalRunCountRef = useRef(0)
  const runningCountRef = useRef(0)
  const [totalRunCount, setTotalRunCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<Result>()
  const useCase = useMemo(() => new UseCaseClass(), [])
  const useCaseName = useCase.constructor.name

  const invalidateTotalRunCount = () => {
    setTotalRunCount(totalRunCountRef.current)
  }

  const invalidateIsRunning = () => {
    setIsRunning(runningCountRef.current > 0)
  }

  const reset = () => {
    useCase.cancel()

    totalRunCountRef.current = 0
    runningCountRef.current = 0
    invalidateTotalRunCount()
    invalidateIsRunning()

    setResult(undefined)
  }

  const interact = async (params: Partial<Params> = {}) => {
    debug(`Interacting with use case <${useCaseName}>...`)

    setResult(undefined)

    totalRunCountRef.current++
    invalidateTotalRunCount()

    runningCountRef.current++
    invalidateIsRunning()

    await useCase.run(params, { skipCache })
      .then(result => {
        debug(`Interacting with use case <${useCaseName}>...`, 'OK', result)

        setResult(result)
        onSuccess?.(result)
      })
      .catch(err => {
        if (err === FetchUseCaseError.REQUEST_CANCELLED) {
          debug(`Interacting with use case <${useCaseName}>...`, 'CANCEL')
          onCancel?.()
        }
        else {
          debug(`Interacting with use case <${useCaseName}>...`, 'ERR', err)
          onError?.(err)
        }
      })
      .finally(() => {
        if (runningCountRef.current > 0) runningCountRef.current--
        invalidateIsRunning()
      })
  }

  useEffect(() => () => {
    useCase.cancel()
  }, [])

  return {
    isRunning,
    runCount: totalRunCount,
    value: result,
    interact,
    reset,
  }
}