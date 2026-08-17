import { Group, Text, TextInput, ThemeIcon, Title } from '@mantine/core'
import { IconWorld, IconSearch } from '@tabler/icons-react'

export function Header() {
  return (
    <Group h="100%" px="md" justify="space-between">
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
      <Group>
        <Text size="sm" c="dimmed">
          Last updated: —
        </Text>
        <TextInput
          placeholder="Search events, locations..."
          leftSection={<IconSearch size={16} />}
          w={280}
        />
      </Group>
    </Group>
  )
}
