import { useEffect } from 'react'
import AppRoutes from './routes'
import { bootstrapCsrf } from './lib/axios'

useEffect(() => { bootstrapCsrf().catch(console.error) }, [])

export const App = () => {
  return <AppRoutes />
}
