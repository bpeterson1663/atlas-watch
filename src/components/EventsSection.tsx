import { Box, ScrollArea, Skeleton } from '@mantine/core'
import { EventList } from './EventList'
import { normalizeEvents } from '../lib/normalize'
import { useEvents } from '../hooks/useEvents'
import { EventMap } from './EventMap'
import { useState } from 'react'

export function EventsSection() {
  const { events, status, message } = useEvents()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const views = status === 'success' ? normalizeEvents(events) : []

  if (status === 'error') {
    return <p>Error loading events: {message}</p>
  }

  return (
    <>
      <Box flex={2} style={{ borderRadius: 8, overflow: 'hidden' }} h="100%">
        {status === 'success' ? (
          <EventMap
            events={views}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : (
          <Skeleton height="100%" />
        )}
      </Box>
      <ScrollArea flex={1} h="100%">
        {status === 'loading' ? (
          <>
            <Skeleton height={88} mb="sm" />
            <Skeleton height={88} mb="sm" />
            <Skeleton height={88} />
          </>
        ) : (
          <EventList
            events={normalizeEvents(events)}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </ScrollArea>
    </>
  )
}
