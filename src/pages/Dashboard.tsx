import { Box, Stack } from '@mantine/core'
import { useMemo } from 'react'
import { EventsSection } from '../components/EventsSection'
import { useEventFilters } from '../hooks/useEventFilters'
import { useCategories } from '../hooks/useCategories'
import { useEvents } from '../hooks/useEvents'
import { FilterBar } from '../components/FilterBar'
import { filterEventsBySearch } from '../lib/filters'
import { normalizeEvents } from '../lib/normalize'

export function Dashboard() {
  const { filters, setFilters } = useEventFilters()
  const { categories, status: categoriesStatus } = useCategories()
  const { events, status: eventsStatus, message } = useEvents(filters)

  const eventCount = useMemo(() => {
    if (eventsStatus !== 'success') {
      return undefined
    }
    return filterEventsBySearch(normalizeEvents(events), filters.q).length
  }, [events, eventsStatus, filters.q])

  return (
    <Stack
      gap="md"
      flex={1}
      h={{ base: 'auto', md: 'calc(100vh - 104px)' }}
      style={{ minHeight: 0 }}
    >
      <FilterBar
        categories={categories}
        categoriesLoading={categoriesStatus === 'loading'}
        filters={filters}
        eventCount={eventCount}
        eventsLoading={eventsStatus === 'loading'}
        onChange={setFilters}
      />
      <Box
        flex={1}
        style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <EventsSection
          filters={filters}
          events={events}
          status={eventsStatus}
          message={message}
        />
      </Box>
    </Stack>
  )
}
