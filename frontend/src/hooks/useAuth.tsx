import { useAuthStore } from '../store/authStore'

// 必要なら型を拡張
export function useAuth() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  return { isAuthenticated }
}
