import { Group } from '@mantine/core'
import { EventsSection } from '../features/events/EventsSection'

export function Dashboard() {
  return (
    <Group align="stretch" grow mt="md" wrap="nowrap" h="calc(100vh - 280px)">
      <EventsSection />
    </Group>
  )
}
