import { Box, Group, Skeleton } from '@mantine/core'
import { EventsSection } from '../features/events/EventsSection'

export function Dashboard() {
  return (
    <Group align="stretch" grow mt="md" wrap="nowrap" h="calc(100vh - 280px)">
      <Box flex={2} bg="gray.1" style={{ borderRadius: 8 }} p="md">
        <Skeleton height="100%" />
      </Box>
      <EventsSection />
    </Group>
  )
}
