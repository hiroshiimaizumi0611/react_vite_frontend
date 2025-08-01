import { Loader2 } from 'lucide-react'
import { EstimateTable } from '../components/estimate/EstimateTable'
import { useEstimates } from '../hooks/useEstimates'
import { Button } from '../components/ui/button'
import { Outlet, useNavigate } from 'react-router-dom'

export const Estimates = () => {
  const navigate = useNavigate()
  const { estimates, error, isLoading, mutate } = useEstimates()

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <Button onClick={() => navigate('/estimates/new')} className="mb-4">
        + 追加
      </Button>
      {isLoading ? (
        <div className="p-8 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
          Loading...
        </div>
      ) : error ? (
        <div className="text-red-500">Failed...</div>
      ) : (
        <EstimateTable estimates={estimates} onDeleted={mutate} />
      )}
      <Outlet />
    </div>
  )
}
