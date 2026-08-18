import { useSearchParams } from 'react-router-dom'
import {
  filtersFromSearchParams,
  searchParamsFromFilters,
} from '../lib/filters'
import type { EventFilters } from '../types/filter'

export function useEventFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = filtersFromSearchParams(searchParams)

  function setFilters(partial: Partial<EventFilters>) {
    const next = { ...filters, ...partial }
    setSearchParams(searchParamsFromFilters(next), { replace: true })
  }

  return { filters, setFilters }
}
