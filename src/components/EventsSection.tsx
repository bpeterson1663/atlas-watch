import { Box, Group, ScrollArea, Skeleton, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { EventList } from './EventList'
import { normalizeEvents } from '../lib/normalize'
import { filterEventsBySearch } from '../lib/filters'
import { EventMap } from './EventMap'
import type { EventFilters } from '../types/filter'
import type { EonetEvent } from '../types/event'
import type { Status } from '../types/status'

interface Props {
  filters: EventFilters
  events: EonetEvent[]
  status: Status
  message: string
}

export function EventsSection({ filters, events, status, message }: Props) {
  const isDesktop = useMediaQuery('(min-width: 62em)', true)
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
        <ScrollArea flex={1} h="100%">
          {listContent}
        </ScrollArea>
      </Group>
    )
  }

  return (
    <Stack gap="md" flex={1} style={{ minHeight: 0 }}>
      <MapPane h={280}>{mapContent}</MapPane>
      <ScrollArea flex={1} style={{ minHeight: 240 }}>
        {listContent}
      </ScrollArea>
    </Stack>
  )
}

function MapPane({
  children,
  h = '100%',
}: {
  children: ReactNode
  h?: number | string
}) {
  return (
    <Box
      flex={2}
      h={h}
      style={{ borderRadius: 8, overflow: 'hidden', minHeight: 0 }}
    >
      {children}
    </Box>
  )
}
