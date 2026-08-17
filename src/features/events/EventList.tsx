import { Stack, Text } from '@mantine/core'
import type { EventView } from '../../shared/types/event'
import { EventCard } from './EventCard'

interface Props {
  events: EventView[]
  selectedId?: string | null
  onSelect?: (id: string) => void
}

export function EventList({ events, selectedId, onSelect }: Props) {
  if (events.length === 0) {
    return <Text c="dimmed">No open events in the last 7 days.</Text>
  }

  return (
    <Stack gap="xs">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          selected={event.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </Stack>
  )
}
