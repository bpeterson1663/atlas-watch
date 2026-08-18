import { Group } from '@mantine/core'
import { EventsSection } from '../components/EventsSection'

export function Dashboard() {
  return (
    <Group align="stretch" grow mt="md" wrap="nowrap" h="calc(100vh - 280px)">
      <EventsSection />
    </Group>
  )
}
