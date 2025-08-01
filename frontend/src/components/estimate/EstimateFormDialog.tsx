import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import type { Estimate } from '../../types/Estimate'
import { addEstimate, updateEstimate } from '../../api/estimate'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog'
import { mutate as globalMutate } from 'swr'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValue?: Partial<Estimate>
  onSubmitted?: () => void
  mode: 'create' | 'edit'
}

export function EstimateFormDialog({
  open,
  onOpenChange,
  defaultValue,
  mode,
}: Props) {
  const isEdit = mode === 'edit'
  const [form, setForm] = useState<Omit<Estimate, 'id'>>({
    title: '',
    customerName: '',
    totalAmount: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setForm({
      title: defaultValue?.title ?? '',
      customerName: defaultValue?.customerName ?? '',
      totalAmount: defaultValue?.totalAmount ?? 0,
    })
    setError(null)
  }, [open, defaultValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === 'totalAmount'
          ? Number(e.target.value)
          : e.target.value,
    })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isEdit && defaultValue?.id) {
        await updateEstimate({ id: defaultValue.id, ...form })
      } else {
        await addEstimate(form)
      }
      await globalMutate('/estimates', undefined, { revalidate: true })
      onOpenChange(false)
    } catch {
      setError(isEdit ? '更新に失敗しました' : '追加に失敗しました')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? '見積を編集' : '見積を追加'}</DialogTitle>
          <DialogDescription>
            {isEdit ? '見積内容を編集できます。' : '新しい見積を登録します。'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="タイトル"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="顧客名"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="totalAmount"
            type="number"
            value={form.totalAmount}
            onChange={handleChange}
            placeholder="合計金額"
            className="w-full border p-2 rounded"
            min={0}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEdit
                  ? '更新中...'
                  : '追加中...'
                : isEdit
                  ? '更新'
                  : '追加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
