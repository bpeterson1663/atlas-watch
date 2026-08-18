import {
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import type { EventView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { IconCalendar, IconMapPin } from '@tabler/icons-react'
import { formatUtc } from '../lib/date'
import { Link, useLocation } from 'react-router-dom'
import classes from './EventCard.module.css'

interface Props {
  event: EventView
  selected?: boolean
  onSelect?: (id: string) => void
}

export function EventCard({ event, selected = false, onSelect }: Props) {
  const location = useLocation()
  const { color, icon: Icon } = categoryStyle(event.categoryId)

  return (
    <Card
      withBorder
      padding="sm"
      radius="md"
      className={onSelect ? classes.clickable : undefined}
      bd={selected ? `1px solid var(--mantine-color-${color}-5)` : undefined}
      onClick={() => onSelect?.(event.id)}
    >
      <ThemeIcon size={44} radius="md" color={color} variant="filled">
        <Icon size={22} />
      </ThemeIcon>

      <Stack gap={4} className={classes.content}>
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
          <Group gap={6} wrap="nowrap" className={classes.location}>
            <IconMapPin size={14} color="gray" />
            <Text size="xs" c="dimmed" lineClamp={1}>
              {event.locationLabel}
            </Text>
          </Group>
          <Badge size="sm" color={color} variant="light">
            {event.categoryTitle}
          </Badge>
        </Group>
        <Button
          component={Link}
          to={{
            pathname: `/events/${encodeURIComponent(event.id)}`,
            search: location.search,
          }}
          size="xs"
          color="navy"
          variant="filled"
          mt={6}
          onClick={(clickEvent) => clickEvent.stopPropagation()}
        >
          View details
        </Button>
      </Stack>
    </Card>
  )
}
