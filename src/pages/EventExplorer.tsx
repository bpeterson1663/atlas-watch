import { Anchor, Group, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { ExplorerEventsSection } from '../components/ExplorerEventsSection'
import { FilterBar } from '../components/FilterBar'
import { useCategories } from '../hooks/useCategories'
import { useEventFilters } from '../hooks/useEventFilters'
import { useEvents } from '../hooks/useEvents'
import { filterEventsBySearch } from '../lib/filters'
import { normalizeEvents } from '../lib/normalize'

export function EventExplorer() {
  const location = useLocation()
  const { filters, setFilters } = useEventFilters()
  const { categories, status: categoriesStatus } = useCategories()
  const { events, status: eventsStatus, message } = useEvents(filters)

  const views = useMemo(() => {
    if (eventsStatus === 'error') {
      return []
    }
    if (eventsStatus === 'loading' && events.length === 0) {
      return []
    }
    return filterEventsBySearch(normalizeEvents(events), filters.q)
  }, [events, eventsStatus, filters.q])

  const eventCount = eventsStatus === 'success' ? views.length : undefined
  const showSkeleton =
    eventsStatus === 'loading' || eventsStatus === 'refreshing'

  return (
    <Stack gap="md" flex={1} h="calc(100vh - 104px)" mih={0}>
      <Anchor
        component={Link}
        to={{ pathname: '/', search: location.search }}
        size="sm"
      >
        <Group gap={6} wrap="nowrap">
          <IconArrowLeft size={14} />
          Back to dashboard
        </Group>
      </Anchor>

      <Title order={3}>Event Explorer</Title>

      <FilterBar
        mode="explorer"
        categories={categories}
        categoriesLoading={categoriesStatus === 'loading'}
        filters={filters}
        eventCount={eventCount}
        eventsLoading={showSkeleton}
        onChange={setFilters}
      />

      {eventsStatus === 'error' ? (
        <Text c="red">Error loading events: {message}</Text>
      ) : showSkeleton && views.length === 0 ? (
        <Text c="dimmed">Loading events…</Text>
      ) : views.length === 0 ? (
        <Text c="dimmed">No events match these filters.</Text>
      ) : (
        <ExplorerEventsSection
          views={views}
          status={eventsStatus}
          message={message}
        />
      )}
    </Stack>
  )
}
