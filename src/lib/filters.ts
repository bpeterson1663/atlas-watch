import type { EventFilters, DaysFilter, StatusFilter } from '../types/filter'
import { DEFAULT_FILTERS } from '../types/filter'

const VALID_STATUS = new Set<StatusFilter>(['open', 'closed', 'all'])
const VALID_DAYS = new Set([7, 30, 90])

function parseStatus(raw: string | null): StatusFilter {
  if (raw && VALID_STATUS.has(raw as StatusFilter)) {
    return raw as StatusFilter
  }
  return DEFAULT_FILTERS.status
}

function parseCategories(raw: string | null): string[] {
  if (!raw) {
    return []
  }
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

export function removeCategory(current: string[], id: string): string[] {
  return current.filter((categoryId) => categoryId !== id)
}

export function toggleCategory(current: string[], id: string): string[] {
  return current.includes(id)
    ? current.filter((categoryId) => categoryId !== id)
    : [...current, id]
}

export function filtersFromSearchParams(params: URLSearchParams): EventFilters {
  const days = Number(params.get('days') ?? DEFAULT_FILTERS.days)
  const status = parseStatus(params.get('status'))
  const categories = parseCategories(params.get('category'))
  const q = params.get('q') ?? ''

  return {
    status,
    days: VALID_DAYS.has(days) ? (days as DaysFilter) : DEFAULT_FILTERS.days,
    categories,
    q,
  }
}

export function searchParamsFromFilters(
  filters: EventFilters,
): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.status !== 'open') {
    params.set('status', filters.status)
  }

  if (filters.days !== 7) {
    params.set('days', String(filters.days))
  }

  if (filters.categories.length > 0) {
    params.set('category', filters.categories.join(','))
  }

  if (filters.q.trim()) {
    params.set('q', filters.q.trim())
  }

  return params
}

export function filterEventsBySearch<
  T extends { title: string; locationLabel: string },
>(events: T[], q: string): T[] {
  const needle = q.trim().toLowerCase()
  if (!needle) {
    return events
  }
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(needle) ||
      event.locationLabel.toLowerCase().includes(needle),
  )
}
