import { Button } from '../../components/ui/button'
import { startLogin } from '../../api/auth'
import { LogIn } from 'lucide-react'

export default function LoginForm() {
  return (
    <div className="space-y-4">
      <Button
        type="button"
        className="w-full"
        onClick={() => startLogin()}
      >
        <LogIn className="mr-2 h-4 w-4" />
        SSOでログイン
      </Button>
    </div>
  )
}
