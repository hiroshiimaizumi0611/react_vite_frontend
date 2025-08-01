import useSWR from 'swr'
import type { Estimate } from '../types/Estimate'
import { getEstimate } from '../api/estimate'

export function useEstimate(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Estimate>(
    `/estimates/${id}`,
    () => getEstimate(id),
  )
  return { estimate: data, error, isLoading, mutate }
}
