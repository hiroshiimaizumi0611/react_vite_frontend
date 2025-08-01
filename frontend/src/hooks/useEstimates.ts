import useSWR from 'swr'
import { getEstimates } from '../api/estimate'
import type { Estimate } from '../types/Estimate'

export function useEstimates() {
  const { data, error, isLoading, mutate } = useSWR<Estimate[]>(
    '/estimates',
    getEstimates,
  )
  return {
    estimates: data ?? [],
    error,
    isLoading,
    mutate,
  }
}
