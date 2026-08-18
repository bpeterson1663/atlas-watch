import { Stack } from '@mantine/core'
import { useEffect, useMemo } from 'react'
import { DashboardEventsSection } from '../components/DashboardEventsSection'
import { useEventFilters } from '../hooks/useEventFilters'
import { useEvents } from '../hooks/useEvents'
import { FilterBar } from '../components/FilterBar'
import { SummaryCards } from '../components/SummaryCards'
import { DASHBOARD_EVENT_LIMIT, DASHBOARD_MAP_LIMIT } from '../lib/constants'
import { toDashboardFilters } from '../lib/filters'
import { normalizeEvents } from '../lib/normalize'
import { buildDashboardSummary } from '../lib/summary'

export function Dashboard() {
  const { filters, setFilters } = useEventFilters()
  const dashboardView = useMemo(() => toDashboardFilters(filters), [filters])

  useEffect(() => {
    if (
      dashboardView.q !== filters.q ||
      dashboardView.days !== filters.days ||
      dashboardView.categories.length !== filters.categories.length
    ) {
      setFilters(dashboardView)
    }
  }, [dashboardView, filters, setFilters])

  const dashboardFilters = useMemo(
    () => ({
      status: dashboardView.status,
      days: dashboardView.days,
      categories: [] as string[],
    }),
    [dashboardView.status, dashboardView.days],
  )

  const { events, status: eventsStatus, message } = useEvents(dashboardFilters)

  const views = useMemo(() => {
    if (eventsStatus === 'error') {
      return []
    }
    if (eventsStatus === 'loading' && events.length === 0) {
      return []
    }
    return normalizeEvents(events)
  }, [events, eventsStatus])

  const listViews = useMemo(
    () => views.slice(0, DASHBOARD_EVENT_LIMIT),
    [views],
  )

  const mapViews = useMemo(() => views.slice(0, DASHBOARD_MAP_LIMIT), [views])

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
      h={{ base: 'auto', md: 'calc(100vh - 88px)' }}
      mih={0}
    >
      <SummaryCards
        summary={summary}
        filters={dashboardView}
        loading={showSkeleton}
      />
      <FilterBar
        mode="dashboard"
        filters={dashboardView}
        eventCount={eventCount}
        eventsLoading={showSkeleton}
        onChange={setFilters}
      />
      <Stack flex={1} mih={0} gap={0}>
        <DashboardEventsSection
          listViews={listViews}
          mapViews={mapViews}
          totalCount={views.length}
          status={eventsStatus}
          message={message}
        />
      </Stack>
    </Stack>
  )
}
