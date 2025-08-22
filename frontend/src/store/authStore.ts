import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  setIsAuthenticated: (v: boolean) => void
}

function hasUiCookie() {
  if (typeof document === 'undefined') return false
  return document.cookie.split('; ').some(c => c.startsWith('UI='))
}

export const useAuthStore = create<AuthStore>(set => ({
  // UI クッキーの存在で初期サインイン状態を判定
  isAuthenticated: hasUiCookie(),
  setIsAuthenticated: v => set({ isAuthenticated: v }),
}))
