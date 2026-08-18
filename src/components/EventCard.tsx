import { Badge, Card, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconCalendar, IconChevronRight, IconMapPin } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import type { EventView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { formatUtc } from '../lib/date'
import classes from './EventCard.module.css'

interface Props {
  event: EventView
}

export function EventCard({ event }: Props) {
  const location = useLocation()
  const { color, icon: Icon } = categoryStyle(event.categoryId)

  return (
    <Card
      component={Link}
      to={{
        pathname: `/events/${encodeURIComponent(event.id)}`,
        search: location.search,
      }}
      withBorder
      padding="sm"
      radius="md"
      className={classes.card}
    >
      <Group className={classes.row} wrap="nowrap" gap="sm" align="center">
        <ThemeIcon size={36} radius="sm" color={color} variant="filled">
          <Icon size={18} />
        </ThemeIcon>

        <Stack gap={2} className={classes.content}>
          <Text fw={600} size="sm" lineClamp={1}>
            {event.title}
          </Text>
          <Group gap={4} wrap="nowrap">
            <IconCalendar size={12} color="gray" />
            <Text size="xs" c="dimmed" lineClamp={1}>
              {formatUtc(event.lastDate)}
            </Text>
          </Group>
          <Group gap={4} wrap="nowrap" className={classes.meta}>
            <IconMapPin size={12} color="gray" />
            <Text size="xs" c="dimmed" lineClamp={1}>
              {event.locationLabel}
            </Text>
          </Group>
        </Stack>

        <Stack gap={4} align="flex-end">
          <Badge
            size="xs"
            color={event.isOpen ? 'red' : 'gray'}
            variant="filled"
          >
            {event.isOpen ? 'ACTIVE' : 'CLOSED'}
          </Badge>
          <Badge size="xs" color={color} variant="light">
            {event.categoryTitle}
          </Badge>
        </Stack>

        <IconChevronRight size={14} className={classes.chevron} />
      </Group>
    </Card>
  )
}
