import { useEffect, useMemo, useRef, useState } from 'react'
import FetchUseCase, { FetchUseCaseError } from '../interactors/FetchUseCase'
import useDebug from '../utils/useDebug'

const debug = useDebug('fetch')

type Options<T> = {
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
   * @param output - The output of the successful use case interaction.
   */
  onSuccess?: (output: T) => void
}

type InteractFunction<T> = (params?: Partial<T>) => Promise<void>

type IsRunning = boolean

type TotalRunCount = number

type ResetStateFunction = () => void

/**
 * Hook for interacting with a {@link FetchUseCase}.
 *
 * @param UseCaseClass - The {@link FetchUseCase} class to interact with.
 * @param options - @see {@link Options}.
 *
 * @returns An array of 5 values:
 *          1. Function for interacting with the use case
 *          2. Result after running the use case (`undefined` on init or if there is an error during run)
 *          3. Boolean indiciating whether the use case is running
 *          4. Total number of runs for this interactor
 *          5. Function to reset the state of this interactor
 */
export default function useFetch<Params extends Record<string, any>, Result>(
  UseCaseClass: new () => FetchUseCase<Params, Result>,
  {
    onCancel,
    onError,
    onSuccess,
  }: Options<Result> = {},
): [InteractFunction<Params>, Result | undefined, IsRunning, TotalRunCount, ResetStateFunction] {
  const totalRunCountRef = useRef(0)
  const runningCountRef = useRef(0)
  const [totalRunCount, setTotalRunCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<Result>()
  const useCase = useMemo(() => new UseCaseClass(), [])
  const useCaseName = useCase.constructor.name

  const invalidateTotalRunCount = () => {
    setTotalRunCount(totalRunCountRef.current)
  }

  const invalidateIsRunning = () => {
    setIsRunning(runningCountRef.current > 0)
  }

  const resetState = () => {
    useCase.cancel()

    totalRunCountRef.current = 0
    runningCountRef.current = 0
    invalidateTotalRunCount()
    invalidateIsRunning()

    setOutput(undefined)
  }

  const interact = async (params: Partial<Params> = {}) => {
    debug(`Interacting with use case <${useCaseName}>...`)

    setOutput(undefined)

    totalRunCountRef.current++
    invalidateTotalRunCount()

    runningCountRef.current++
    invalidateIsRunning()

    await useCase.run(params)
      .then(result => {
        debug(`Interacting with use case <${useCaseName}>...`, 'OK', result)

        setOutput(result)
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

  return [interact, output, isRunning, totalRunCount, resetState]
}
