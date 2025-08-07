import axios from 'axios'
import type { LoginResponse } from '../api/auth'

export const api = axios.create({
  baseURL: '/api/',
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  // ===== ここから変更 =====
  // 第一引数：通信成功時のハンドラ
  res => {
    // レスポンスヘッダーからContent-Typeを取得
    const contentType = res.headers['content-type']

    // Content-Typeが 'text/html' を含んでいたらメンテナンスモードと判断
    if (contentType && contentType.includes('text/html')) {
      console.warn('メンテナンスモードを検知しました。ページをリロードします。')

      // ページを強制的にリロードし、ALBのリダイレクトに従わせる
      window.location.reload()

      // 後続の処理を中断するために、エラーとして処理を終了
      return Promise.reject(new Error('Maintenance Mode Detected'))
    }

    // メンテナンスモードでなければ、元のレスポンスをそのまま返す
    return res
  }, async err => {
    const originalRequest = err.config

    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          throw new Error('No refreshToken')
        }
        const res = await axios.post<LoginResponse>('/api/refresh', {
          refreshToken,
        })

        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
        return axios(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(err)
  },
)
