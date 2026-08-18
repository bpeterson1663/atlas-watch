import { Badge, Card, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import type { EventView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { IconCalendar, IconMapPin } from '@tabler/icons-react'
import { formatUtc } from '../lib/date'

interface Props {
  event: EventView
  selected?: boolean
  onSelect?: (id: string) => void
}

export function EventCard({ event, selected = false, onSelect }: Props) {
  const { color, icon: Icon } = categoryStyle(event.categoryId)

  return (
    <Card
      withBorder
      padding="sm"
      radius="md"
      style={{
        cursor: onSelect ? 'pointer' : 'default',
        borderColor: selected ? `var(--mantine-color-${color}-5)` : undefined,
      }}
      onClick={() => onSelect?.(event.id)}
    >
      <ThemeIcon size={44} radius="md" color={color} variant="filled">
        <Icon size={22} />
      </ThemeIcon>

      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Text fw={600} lineClamp={2}>
            {event.title}
          </Text>
          <Badge
            size="sm"
            color={event.isOpen ? 'red' : 'gray'}
            variant="filled"
          >
            {event.isOpen ? 'ACTIVE' : 'CLOSED'}
          </Badge>
        </Group>
        <Group gap={6} wrap="nowrap">
          <IconCalendar size={14} color="gray" />
          <Text size="xs" c="dimmed">
            {formatUtc(event.lastDate)}
          </Text>
        </Group>
        <Group justify="space-between" wrap="nowrap" align="flex-end">
          <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
            <IconMapPin size={14} color="gray" />
            <Text size="xs" c="dimmed" lineClamp={1}>
              {event.locationLabel}
            </Text>
          </Group>
          <Badge size="sm" color={color} variant="light">
            {event.categoryTitle}
          </Badge>
        </Group>
      </Stack>
    </Card>
  )
}
