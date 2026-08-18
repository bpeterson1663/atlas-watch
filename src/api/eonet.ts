import { apiGet } from './client'
import type { EonetEvent } from '../types/event'
import type { Category } from '../types/category'
import type { DaysFilter, StatusFilter } from '../types/filter'

interface EonetResponseBase {
  title: string
  description: string
  link: string
}

interface EonetEventsResponse extends EonetResponseBase {
  events: EonetEvent[]
}

interface EonetCategoryResponse extends EonetResponseBase {
  categories: Category[]
}

export function getCategories(
  signal?: AbortSignal,
): Promise<EonetCategoryResponse> {
  return apiGet<EonetCategoryResponse>('/categories', { signal })
}

export function getEvents(
  filters: { status: StatusFilter; days: DaysFilter; categories: string[] },
  signal?: AbortSignal,
): Promise<EonetEventsResponse> {
  const params = new URLSearchParams({
    status: filters.status,
    days: String(filters.days),
  })

  if (filters.categories.length > 0) {
    params.set('category', filters.categories.join(','))
  }

  return apiGet<EonetEventsResponse>(`/events?${params}`, { signal })
}
