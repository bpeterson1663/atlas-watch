import { Stack } from '@mantine/core'
import { useMemo } from 'react'
import { EventsSection } from '../components/EventsSection'
import { useEventFilters } from '../hooks/useEventFilters'
import { useCategories } from '../hooks/useCategories'
import { useEvents } from '../hooks/useEvents'
import { FilterBar } from '../components/FilterBar'
import { SummaryCards } from '../components/SummaryCards'
import { DASHBOARD_EVENT_LIMIT } from '../lib/constants'
import { filterEventsBySearch } from '../lib/filters'
import { normalizeEvents } from '../lib/normalize'
import { buildDashboardSummary } from '../lib/summary'

export function Dashboard() {
  const { filters, setFilters } = useEventFilters()
  const { categories, status: categoriesStatus } = useCategories()
  const { events, status: eventsStatus, message } = useEvents(filters)

  const normalizedViews = useMemo(() => {
    if (eventsStatus === 'error') {
      return []
    }
    if (eventsStatus === 'loading' && events.length === 0) {
      return []
    }
    return normalizeEvents(events)
  }, [events, eventsStatus])

  const views = useMemo(
    () => filterEventsBySearch(normalizedViews, filters.q),
    [normalizedViews, filters.q],
  )

  const displayViews = useMemo(
    () => views.slice(0, DASHBOARD_EVENT_LIMIT),
    [views],
  )

  const summary = useMemo(
    () => buildDashboardSummary(views, events),
    [views, events],
  )

  const eventCount = eventsStatus === 'success' ? views.length : undefined

  const showSkeleton =
    eventsStatus === 'loading' || eventsStatus === 'refreshing'

  return (
    <Stack
      gap="md"
      flex={1}
      h={{ base: 'auto', md: 'calc(100vh - 104px)' }}
      mih={0}
    >
      <FilterBar
        categories={categories}
        categoriesLoading={categoriesStatus === 'loading'}
        filters={filters}
        eventCount={eventCount}
        eventsLoading={showSkeleton}
        onChange={setFilters}
      />
      <SummaryCards
        summary={summary}
        filters={filters}
        loading={showSkeleton}
      />
      <Stack flex={1} mih={0} gap={0}>
        <EventsSection
          views={displayViews}
          totalCount={views.length}
          status={eventsStatus}
          message={message}
        />
      </Stack>
    </Stack>
  )
}
