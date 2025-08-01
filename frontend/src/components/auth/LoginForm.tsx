import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/auth'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Loader2 } from 'lucide-react'
import { oidcConfig } from '../../config/oidcConfig'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true);
    try {
      await login(username, password)
      navigate('/')
    } catch (error: any) {
      setError(error?.detail || 'Login failed')
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Login
        </Button>
      </form>

      <div className="my-4 flex items-center">
        <div className="flex-grow border-t" />
        <span className="mx-2 text-gray-400 text-sm">or</span>
        <div className="flex-grow border-t" />
      </div>

      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2"
        type="button"
        onClick={() => {
          const cognitoDomain = oidcConfig.cognitoDomain;
          const clientId = oidcConfig.clientId;
          const redirectUri = encodeURIComponent(oidcConfig.redirectUri!);
          const scope = encodeURIComponent('openid profile email');
          const state = crypto.randomUUID();
          localStorage.setItem('pkce_state', state);

          const loginUrl = `${cognitoDomain}/login?response_type=code&client_id=${clientId}` + `&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
          window.location.href = loginUrl;
        }}
      >
        Cognitoでログイン
      </button>
    </div >
  )
}
