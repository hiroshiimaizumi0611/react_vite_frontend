import axios from 'axios'
import type { LoginResponse } from '../api/auth'

const MAINTENANCE_URL = 'https://estimate-app-sorrypage.s3.ap-northeast-1.amazonaws.com/index.html'

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
  res => res,
  async err => {
    const originalRequest = err.config

    console.error('---------------------------------------')
    console.error(err.response)
    console.error(err.response.status)

    // [追加] メンテナンスモード検知（503）
    if (err.response && err.response.status === 503) {
      console.warn('メンテナンスモードを検知しました。メンテナンスページへ遷移します。')
      window.location.href = MAINTENANCE_URL
      return Promise.reject(new Error('Maintenance Mode Detected'))
    }

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