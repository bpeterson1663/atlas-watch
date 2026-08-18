import { Group, ScrollArea, Skeleton, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useMemo, useState } from 'react'
import { EventList } from './EventList'
import { normalizeEvents } from '../lib/normalize'
import { filterEventsBySearch } from '../lib/filters'
import { EventMap } from './EventMap'
import { MapPane } from './MapPane'
import type { EventFilters } from '../types/filter'
import type { EonetEvent } from '../types/event'
import type { Status } from '../types/status'

const MOBILE_MAP_HEIGHT = 280

interface Props {
  filters: EventFilters
  events: EonetEvent[]
  status: Status
  message: string
}

export function EventsSection({ filters, events, status, message }: Props) {
  const isDesktop = useMediaQuery('(min-width: 62em)')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const views = useMemo(() => {
    if (status !== 'success') {
      return []
    }
    return filterEventsBySearch(normalizeEvents(events), filters.q)
  }, [events, status, filters.q])

  useEffect(() => {
    setSelectedId(null)
  }, [filters.status, filters.days, filters.categories.join(','), filters.q])

  useEffect(() => {
    if (selectedId && !views.some((event) => event.id === selectedId)) {
      setSelectedId(null)
    }
  }, [views, selectedId])

  if (status === 'error') {
    return <p>Error loading events: {message}</p>
  }

  const mapContent =
    status === 'success' ? (
      <EventMap
        events={views}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    ) : (
      <Skeleton height="100%" />
    )

  const listContent =
    status === 'loading' ? (
      <>
        <Skeleton height={88} mb="sm" />
        <Skeleton height={88} mb="sm" />
        <Skeleton height={88} />
      </>
    ) : (
      <EventList
        events={views}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    )

  if (isDesktop) {
    return (
      <Group
        align="stretch"
        grow
        wrap="nowrap"
        flex={1}
        style={{ minHeight: 0 }}
      >
        <MapPane>{mapContent}</MapPane>
        <ScrollArea flex={1} h="100%" type="hover">
          {listContent}
        </ScrollArea>
      </Group>
    )
  }

  return (
    <Stack gap="md" flex={1} style={{ minHeight: 0 }}>
      <MapPane fixedHeight={MOBILE_MAP_HEIGHT}>{mapContent}</MapPane>
      <ScrollArea flex={1} style={{ minHeight: 240 }} type="hover">
        {listContent}
      </ScrollArea>
    </Stack>
  )
}
