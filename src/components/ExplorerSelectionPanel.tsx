import {
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import type { EventView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { formatUtc } from '../lib/date'

interface Props {
  event: EventView
}

export function ExplorerSelectionPanel({ event }: Props) {
  const location = useLocation()
  const { color, icon: Icon } = categoryStyle(event.categoryId)

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="md">
        <Group align="flex-start" wrap="nowrap" gap="sm">
          <ThemeIcon size={44} radius="md" color={color} variant="filled">
            <Icon size={22} />
          </ThemeIcon>
          <Stack gap={4} flex={1} miw={0}>
            <Group justify="space-between" wrap="nowrap" align="flex-start">
              <Title order={4} lh={1.2} lineClamp={2}>
                {event.title}
              </Title>
              <Badge
                size="sm"
                color={event.isOpen ? 'red' : 'gray'}
                variant="filled"
              >
                {event.isOpen ? 'ACTIVE' : 'CLOSED'}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {event.locationLabel}
            </Text>
            <Text size="xs" c="dimmed">
              ID: {event.id}
            </Text>
          </Stack>
        </Group>

        {event.description && (
          <Paper withBorder p="sm" radius="md" bg="teal.0">
            <Text size="sm">{event.description}</Text>
          </Paper>
        )}

        <SimpleGrid cols={2} spacing="sm">
          <Stat label="First observed" value={formatUtc(event.firstDate)} />
          <Stat label="Latest observation" value={formatUtc(event.lastDate)} />
          <Stat
            label="Geometry / History"
            value={`${event.geometryCount} observations`}
          />
          <Stat label="Sources" value={String(event.sourceCount)} />
        </SimpleGrid>

        <Button
          component={Link}
          to={{
            pathname: `/events/${encodeURIComponent(event.id)}`,
            search: location.search,
          }}
          color="navy"
          variant="light"
          rightSection={<IconExternalLink size={16} />}
          fullWidth
        >
          View full event details
        </Button>
      </Stack>
    </Paper>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      <Text size="sm" fw={500}>
        {value}
      </Text>
    </Stack>
  )
}
