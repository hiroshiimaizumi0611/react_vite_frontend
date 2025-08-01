import { useParams, useNavigate } from 'react-router-dom'
import { useEstimate } from '../../hooks/useEstimate'
import { EstimateFormDialog } from './EstimateFormDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Skeleton } from '../ui/skeleton'

export function EstimateEditModal() {
  const { id } = useParams()
  if (!id) return <div>invalid parameter</div>
  const { estimate, isLoading, error } = useEstimate(id)
  const navigate = useNavigate()
  const handleClose = () => navigate('/estimates')

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={() => navigate('/estimates')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>見積を編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Skeleton className="h-10 w-full rounded" /> {/* タイトル欄 */}
            <Skeleton className="h-10 w-full rounded" /> {/* 顧客名欄 */}
            <Skeleton className="h-10 w-1/2 rounded" /> {/* 合計欄 */}
            <Skeleton className="h-10 w-24 rounded" /> {/* ボタンなど */}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) return <div className="text-red-500">読込エラー</div>

  return (
    <EstimateFormDialog
      open={true}
      defaultValue={estimate}
      mode={'edit'}
      onOpenChange={open => !open && handleClose()}
    />
  )
}
