import { Group, Text, ThemeIcon, Title } from '@mantine/core'
import { IconWorld } from '@tabler/icons-react'

export function Header() {
  return (
    <Group
      h="100%"
      px="md"
      py={{ base: 'xs', sm: 0 }}
      justify="space-between"
      align="center"
      wrap="wrap"
      gap="sm"
    >
      <Group gap="sm">
        <ThemeIcon variant="light" color="navy" size="lg" radius="md">
          <IconWorld size={20} />
        </ThemeIcon>
        <div>
          <Title order={4}>Atlas Watch</Title>
          <Text size="xs" c="dimmed">
            Explore active natural events around the world
          </Text>
        </div>
      </Group>
    </Group>
  )
}
