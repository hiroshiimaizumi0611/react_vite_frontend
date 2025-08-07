import {
  BarChart3,
  Building2,
  ChevronRight,
  Download,
  FileText,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../ui/avatar'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

export const SideBar = () => (
  <aside className="w-64 bg-white border-r flex-shrink-0 flex flex-col py-6 px-4">
    <div className="mb-8 flex items-center">
      <Avatar className="mr-3" />
      <span className="font-bold text-2xl">メニュー</span>
    </div>
    <Separator />
    <nav className="flex-1 mt-8 flex flex-col gap-2">
      <Link to="/" className="mr-4">
        <Button variant="secoundary" className="justify-start w-full">
          <BarChart3 className="mr-3 h-5 w-5" />
          ホーム
        </Button>
      </Link>
      <Link to="/estimateDownload" className="mr-4">
        <Button variant="secoundary" className="justify-start w-full">
          <Download className="mr-3 h-5 w-5" />
          Excelダウンロード
        </Button>
      </Link>
      <Link to="/csvDownload" className="mr-4">
        <Button variant="secoundary" className="justify-start w-full">
          <FileText className="mr-3 h-5 w-5" />
          CSVダウンロード
        </Button>
      </Link>
      <Link to="/estimates" className="mr-4">
        <Button variant="secoundary" className="justify-start w-full">
          <FileText className="mr-3 h-5 w-5" />
          見積管理
        </Button>
      </Link>
      <Button variant="ghost" className="justify-start w-full">
        <ChevronRight className="mr-3 h-5 w-5" />
        受注一覧
      </Button>
      <Button variant="ghost" className="justify-start w-full">
        <Building2 className="mr-3 h-5 w-5" />
        会社情報
      </Button>
      {/* 他メニュー... */}
    </nav>
  </aside>
)
