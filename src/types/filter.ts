export type StatusFilter = 'open' | 'closed' | 'all'

export type DaysFilter = 7 | 30 | 90

export interface EventFilters {
  status: StatusFilter
  days: DaysFilter
  categories: string[]
  q: string
}

export const DEFAULT_FILTERS: EventFilters = {
  status: 'open',
  days: 7,
  categories: [],
  q: '',
}
