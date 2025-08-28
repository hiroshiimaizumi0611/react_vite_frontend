import axios from 'axios'

const MAINTENANCE_URL = 'https://estimate-app-sorrypage.s3.ap-northeast-1.amazonaws.com/index.html'

export const api = axios.create({
  baseURL: '/api/',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

// CSRF ヘルパ: XSRF-TOKEN Cookie が無ければ取得
async function ensureCsrf() {
  const has = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)
  if (!has) {
    console.debug('[axios] XSRF-TOKEN not present. Fetching /api/csrf ...')
    // same-origin 前提。もし別オリジン構成の場合は 'include' に変更してCORS対応が必要
    await fetch('/api/csrf', { credentials: 'same-origin' })
    console.debug('[axios] /api/csrf fetched. Cookie should be set.')
  }
}

// refresh 併発制御（多重401発生時に1回だけ実行）
let refreshPromise: Promise<void> | null = null

// Authorization ヘッダは使用せず、Cookie (AT) を送信
api.interceptors.response.use(
  res => res,
  async err => {
    const res = err?.response as { status?: number } | undefined
    const cfg = (err?.config || {}) as any
    const url: string = (cfg?.url || '')
    const status = res?.status
    if (status) {
      console.debug('[axios] response error:', status, 'for', url)
    }

    // 503: メンテナンス誘導
    if (res?.status === 503) {
      window.location.href = MAINTENANCE_URL
      return Promise.reject(err)
    }

    const isRefresh = /(^|\/)auth\/refresh(\?|$)/.test(url)

    // リフレッシュ自身は対象外（無限ループ防止）だが、401/403 の場合はフォールバックで即リダイレクト
    if (isRefresh) {
      if (status === 401 || status === 403) {
        console.debug('[axios] refresh returned', status, '→ redirect to OAuth2')
        window.location.assign('/oauth2/authorization/azure')
      }
      return Promise.reject(err)
    }

    // 401 を1回だけリトライ（refresh → 元リクエスト再実行）
    if (status === 401 && !cfg.__retried) {
      cfg.__retried = true
      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            await ensureCsrf()
            // xsrfCookieName/xsrfHeaderName 設定により axios が自動でヘッダ付与
            console.debug('[axios] attempting refresh ...')
            try {
              await api.post('auth/refresh')
              console.debug('[axios] refresh succeeded')
            } catch (e: any) {
              // 稀にトークン不一致などで 403 が発生した場合、再取得して一度だけ再試行
              if (e?.response?.status === 403) {
                console.debug('[axios] refresh 403. Re-fetching CSRF and retrying refresh once ...')
                await ensureCsrf()
                await api.post('auth/refresh')
                console.debug('[axios] refresh retry succeeded')
              } else {
                console.warn('[axios] refresh failed:', e?.response?.status)
                throw e
              }
            }
          })()
        }
        await refreshPromise
        refreshPromise = null
        console.debug('[axios] retrying original request after refresh:', url)
        return api(cfg)
      } catch (e) {
        refreshPromise = null
        // refresh も失敗 → ログイン導線へ
        console.debug('[axios] refresh failed. Redirecting to OAuth2 login ...')
        window.location.assign('/oauth2/authorization/azure')
        return Promise.reject(e)
      }
    }

    return Promise.reject(err)
  },
)
