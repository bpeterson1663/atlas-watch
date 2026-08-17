import { Box, Group, ScrollArea, Skeleton } from '@mantine/core'

export function Dashboard() {
  return (
    <Group align="stretch" grow mt="md" wrap="nowrap" h="calc(100vh - 280px)">
      <Box flex={2} bg="gray.1" style={{ borderRadius: 8 }} p="md">
        <Skeleton height="100%" />
      </Box>
      <ScrollArea flex={1} h="100%">
        <Skeleton height={88} mb="sm" />
        <Skeleton height={88} mb="sm" />
        <Skeleton height={88} />
      </ScrollArea>
    </Group>
  )
}
