import { Bell, Settings, User } from 'lucide-react'
import { logout } from '../../api/auth'
import { Button } from '../ui/button'

const logoutFunc = async () => {
  await logout()
}

export const Header = () => (
  <header className="h-16 bg-black text-amber-50 border-b flex items-center justify-between px-6">
    <div className="font-bold text-xl">見積君</div>
    <div className="flex items-center gap-4">
      <span>123456 営業部</span>
      <span>〇〇太郎</span>
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
      <Button variant="super" size="sm" onClick={logoutFunc}>
        ログアウト
      </Button>
    </div>
  </header>
)
