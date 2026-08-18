import { useEffect, useState } from 'react'
import type { Category } from '../types/category'
import type { Status } from '../types/status'
import { getCategories } from '../api/eonet'
import { isAbortError } from '../api/error'

interface CategoryState {
  status: Status
  message: string
  categories: Category[]
}

export function useCategories() {
  const [state, setState] = useState<CategoryState>({
    status: 'loading',
    message: '',
    categories: [],
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadEvents() {
      try {
        const { categories } = await getCategories(controller.signal)

        setState({ message: '', categories, status: 'success' })
      } catch (err) {
        if (isAbortError(err)) {
          return
        }

        const message =
          err instanceof Error ? err.message : 'Failed to load events'
        setState({ status: 'error', message, categories: [] })
      }
    }

    void loadEvents()

    return () => {
      controller.abort()
    }
  }, [])

  return state
}
