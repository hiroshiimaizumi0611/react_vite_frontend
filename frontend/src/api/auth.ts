import { api } from '../lib/axios'
import { useAuthStore } from '../store/authStore'

// SSO 開始：バックエンドの Spring Security へ移譲
export function startLogin(registrationId?: 'azure' | 'cognito') {
  const stage = (import.meta.env.VITE_STAGE as string | undefined) ?? 'dev'
  const id = registrationId ?? (stage === 'dev' ? 'cognito' : 'azure')
  window.location.href = `/oauth2/authorization/${id}`
}

// 端末ログアウト：Cookie をクリアして 204 を返す
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    useAuthStore.getState().setIsAuthenticated(false)
    window.location.href = '/login'
  }
}
