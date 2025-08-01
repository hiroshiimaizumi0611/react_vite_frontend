import { useState } from 'react'
import type { Estimate } from '../../types/Estimate'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../../components/ui/alert-dialog'
import { Loader2, Pencil, Trash2 } from 'lucide-react'
import { deleteEstimate } from '../../api/estimate'
import { useNavigate } from 'react-router-dom'

interface Props {
  estimates: Estimate[]
  onDeleted: () => void
}

export function EstimateTable({ estimates, onDeleted }: Props) {
  const navigate = useNavigate()

  const [targetId, setTargetId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (targetId == null) return
    setDeletingId(targetId)
    try {
      await deleteEstimate(targetId)
      onDeleted()
    } finally {
      setDeletingId(null)
      setTargetId(null)
    }
  }

  return (
    <Table className="shadow-xl rounded-lg border border-gray-200 overflow-hidden">
      <TableHeader className="bg-blue-50">
        <TableRow>
          <TableHead className="w-12 text-center">#</TableHead>
          <TableHead>タイトル</TableHead>
          <TableHead>顧客名</TableHead>
          <TableHead className="text-right">合計金額 (円)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {estimates.map(e => (
          <TableRow
            key={e.id}
            className="hover:bg-blue-100 transition-colors duration-100"
          >
            <TableCell className="font-bold text-center">{e.id}</TableCell>
            <TableCell className="font-medium">{e.title}</TableCell>
            <TableCell>{e.customerName}</TableCell>
            <TableCell className="text-right text-blue-700 font-semibold">
              {e.totalAmount?.toLocaleString()}円
            </TableCell>
            <TableCell className="w-12">
              <button
                onClick={() => navigate(`/estimates/${e.id}/edit`)}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="編集"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </TableCell>
            <TableCell className="text-center w-16">
              <AlertDialog
                open={targetId === e.id}
                onOpenChange={open => setTargetId(open ? e.id! : null)}
              >
                <AlertDialogTrigger asChild>
                  <button
                    className="p-1 text-red-600 hover:text-red-800"
                    title="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作は取り消せません。よろしいですか？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deletingId === e.id}>
                      キャンセル
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={deletingId === e.id}
                      onClick={handleDelete}
                    >
                      {deletingId === e.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1 inline-block" />
                      ) : null}
                      削除する
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
