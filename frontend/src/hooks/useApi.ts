import { useState, useCallback } from 'react'

export const useApi = <T>(
  fn: () => Promise<any>,
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fn()
      setData(response.data)
      return response.data
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'An error occurred'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, deps)

  return { data, loading, error, execute }
}
