import { api } from '../lib/axios'
import { downloadBlob } from '../lib/download'
import type { Estimate } from '../types/Estimate'

export async function downloadEstimatesExcel(): Promise<void> {
  const response = await api.get('/estimates/download', {
    responseType: 'blob',
  })

  const disposition = response.headers['content-disposition']
  const fileName = disposition
    ? disposition.match(/filename="?(.+)"?/)?.[1] || 'estimates.xlsx'
    : 'estimates.xlsx'

  downloadBlob(response.data, fileName)
}

export async function getEstimates(): Promise<Estimate[]> {
  const res = await api.get<Estimate[]>('/estimates')
  return res.data
}

export async function getEstimate(id: string): Promise<Estimate> {
  const res = await api.get<Estimate>(`/estimates/${id}`)
  return res.data
}

export async function addEstimate(estimate: Omit<Estimate, 'id'>) {
  await api.post('/estimates', estimate)
}

export async function deleteEstimate(id: string) {
  await api.delete(`/estimates/${id}`)
}

export async function updateEstimate(estimate: Estimate) {
  await api.put(`/estimates/${estimate.id}`, estimate)
}
