import { useNavigate } from 'react-router-dom'
import { EstimateFormDialog } from './EstimateFormDialog'

export function EstimateCreateModal() {
  const navigate = useNavigate()

  const handleClose = () => navigate('/estimates')

  return (
    <EstimateFormDialog
      open={true}
      mode={'create'}
      onOpenChange={open => !open && handleClose()}
    />
  )
}
