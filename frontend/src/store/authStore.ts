import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  setIsAuthenticated: (v: boolean) => void
}

export const useAuthStore = create<AuthStore>(set => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  setIsAuthenticated: v => set({ isAuthenticated: v }),
}))
