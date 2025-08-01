import { useState } from 'react'
import { addEstimate } from '../../api/estimate'

type FormState = {
  title: string
  customerName: string
  totalAmount: number
}

interface Props {
  onAdded?: () => void // 追加成功後に呼ぶ
}

export function EstimateAddForm({ onAdded }: Props) {
  const [form, setForm] = useState<FormState>({
    title: '',
    customerName: '',
    totalAmount: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      await addEstimate(form)
      setForm({ title: '', customerName: '', totalAmount: 0 })
      onAdded?.() // 追加成功時にコール
    } catch {
      setError('追加に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg mb-8 bg-white shadow flex gap-4 items-center"
    >
      <input
        name="title"
        className="border p-2 rounded w-56"
        value={form.title}
        onChange={handleChange}
        placeholder="タイトル"
        required
      />
      <input
        name="customerName"
        className="border p-2 rounded w-56"
        value={form.customerName}
        onChange={handleChange}
        placeholder="顧客名"
        required
      />
      <input
        name="totalAmount"
        className="border p-2 rounded w-40"
        type="number"
        value={form.totalAmount}
        onChange={handleChange}
        placeholder="合計金額"
        min={0}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? '追加中...' : '追加'}
      </button>
      {error && <div className="text-red-500 text-sm ml-4">{error}</div>}
    </form>
  )
}
