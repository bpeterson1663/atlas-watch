import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  filtersFromSearchParams,
  searchParamsFromFilters,
} from '../lib/filters'
import type { EventFilters } from '../types/filter'

export function useEventFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = filtersFromSearchParams(searchParams)

  const setFilters = useCallback(
    (partial: Partial<EventFilters>) => {
      setSearchParams(
        (prev) => {
          const current = filtersFromSearchParams(prev)
          return searchParamsFromFilters({ ...current, ...partial })
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return { filters, setFilters }
}
