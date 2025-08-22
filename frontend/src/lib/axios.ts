import axios from 'axios'

const MAINTENANCE_URL = 'https://estimate-app-sorrypage.s3.ap-northeast-1.amazonaws.com/index.html'

export const api = axios.create({
  baseURL: '/api/',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

// Authorization ヘッダは使用せず、Cookie (AT) を送信

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config

    console.error('---------------------------------------')
    console.error(err.response)
    console.error(err.response?.status)

    // [追加] メンテナンスモード検知（503）
    if (err.response && err.response.status === 503) {
      console.warn('メンテナンスモードを検知しました。メンテナンスページへ遷移します。')
      window.location.href = MAINTENANCE_URL
      return Promise.reject(new Error('Maintenance Mode Detected'))
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Cookie ベースのリフレッシュ
        await api.post('/auth/refresh')
        // 新しい AT が Cookie で返るので、元のリクエストを再試行
        return api(originalRequest)
      } catch (refreshError) {
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(err)
  },
)
