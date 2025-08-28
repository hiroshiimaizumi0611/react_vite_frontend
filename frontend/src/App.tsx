import { useEffect } from 'react'
import AppRoutes from './routes'
import { bootstrapCsrf } from './lib/axios'

export const App = () => {
  useEffect(() => {
    bootstrapCsrf().catch(console.error)
  }, [])
  return <AppRoutes />
}
