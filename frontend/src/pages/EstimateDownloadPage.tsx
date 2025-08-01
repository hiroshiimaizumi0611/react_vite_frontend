import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { downloadEstimatesExcel } from '../api/estimate'
import { Button } from '../components/ui/button'

export const EstimateDownloadPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setError(null)
    setLoading(true)
    try {
      await downloadEstimatesExcel()
    } catch (e) {
      setError('ダウンロードに失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <Button
        size="lg"
        className="flex items-center gap-2 w-auto"
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Download className="mr-1 h-5 w-5" />
        )}
        {loading ? 'DOWNLOADING...' : 'ESTIMATE DOWNLOAD'}
      </Button>
      {error && <div className="mt-4 text-red-400">{error}</div>}
    </div>
  )
}
