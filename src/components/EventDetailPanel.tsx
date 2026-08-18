import {
  Badge,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import type { EventDetailView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { formatUtc } from '../lib/date'

interface Props {
  event: EventDetailView
}

export function EventDetailPanel({ event }: Props) {
  const { color, icon: Icon } = categoryStyle(event.categoryId)

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="md">
        <Group align="flex-start" wrap="nowrap" gap="sm">
          <ThemeIcon size={44} radius="md" color={color} variant="filled">
            <Icon size={22} />
          </ThemeIcon>
          <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
            <Group justify="space-between" wrap="nowrap" align="flex-start">
              <Title order={3} lh={1.2}>
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
            <Badge size="sm" color={color} variant="light" w="fit-content">
              {event.categoryTitle}
            </Badge>
          </Stack>
        </Group>

        {event.description && <Text size="sm">{event.description}</Text>}

        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
          <Stat label="First observed" value={formatUtc(event.firstDate)} />
          <Stat label="Latest observed" value={formatUtc(event.lastDate)} />
          <Stat
            label="Geometry / History"
            value={observationLabel(event.observations.length)}
          />
          <Stat
            label="Magnitude (max)"
            value={formatMagnitude(event.maxMagnitude)}
          />
          <Stat label="Status" value={event.isOpen ? 'Active' : 'Closed'} />
          <Stat label="Sources" value={sourceLabel(event.sources.length)} />
        </SimpleGrid>
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
      <Text size="sm" fw={600}>
        {value}
      </Text>
    </Stack>
  )
}

function observationLabel(count: number) {
  return `${count} ${count === 1 ? 'observation' : 'observations'}`
}

function sourceLabel(count: number) {
  return `${count} ${count === 1 ? 'source' : 'sources'}`
}

function formatMagnitude(magnitude: EventDetailView['maxMagnitude']): string {
  if (!magnitude) {
    return '—'
  }

  const value = Number.isInteger(magnitude.value)
    ? String(magnitude.value)
    : magnitude.value.toLocaleString('en-US', { maximumFractionDigits: 2 })

  return magnitude.unit ? `${value} ${magnitude.unit}` : value
}
