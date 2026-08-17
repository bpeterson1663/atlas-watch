import { ScrollArea, Skeleton } from '@mantine/core'
import { EventList } from './EventList'
import { normalizeEvents } from './utils/normalize'
import { useEvents } from './useEvents'

export function EventsSection() {
  const { events, status, message } = useEvents()

  if (status === 'error') {
    return <p>Error loading events: {message}</p>
  }

  return (
    <ScrollArea flex={1} h="100%">
      {status === 'loading' ? (
        <>
          <Skeleton height={88} mb="sm" />
          <Skeleton height={88} mb="sm" />
          <Skeleton height={88} />
        </>
      ) : (
        <EventList events={normalizeEvents(events)} />
      )}
      {status === 'success' && <EventList events={normalizeEvents(events)} />}
    </ScrollArea>
  )
}
