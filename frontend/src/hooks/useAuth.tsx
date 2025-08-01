import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  return { isAuthenticated }
}
