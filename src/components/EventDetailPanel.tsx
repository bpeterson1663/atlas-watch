import {
  Anchor,
  Badge,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'
import type { EventDetailView, EventObservation } from '../types/event'
import { categoryStyle } from '../lib/category'
import { formatUtc } from '../lib/date'
import { formatLatLng, observationColor } from '../lib/observation'

interface Props {
  event: EventDetailView
}

export function EventDetailPanel({ event }: Props) {
  const { color, icon: Icon } = categoryStyle(event.categoryId)

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="lg">
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

        {event.sources.length > 0 && <SourceList sources={event.sources} />}
        {event.observations.length > 0 && (
          <HistoryList observations={event.observations} />
        )}
      </Stack>
    </Paper>
  )
}

function SourceList({ sources }: { sources: EventDetailView['sources'] }) {
  return (
    <Stack gap="xs">
      <SectionLabel>Sources</SectionLabel>
      {sources.map((source) => (
        <Anchor
          key={`${source.id}-${source.url}`}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
        >
          <Group gap={6} wrap="nowrap">
            <span>{source.id}</span>
            <IconExternalLink size={14} />
          </Group>
        </Anchor>
      ))}
    </Stack>
  )
}

function HistoryList({ observations }: { observations: EventObservation[] }) {
  const newestFirst = [...observations].reverse()

  return (
    <Stack gap="xs">
      <SectionLabel>Event history (latest first)</SectionLabel>
      {newestFirst.map((observation, displayIndex) => {
        const index = observations.length - 1 - displayIndex
        const color = observationColor(index, observations.length)
        const hasCoords =
          Number.isFinite(observation.lat) && Number.isFinite(observation.lng)
        const location = hasCoords
          ? formatLatLng(observation.lat as number, observation.lng as number)
          : 'Location unavailable'
        const magnitude =
          observation.magnitudeValue == null
            ? null
            : formatMagnitude({
                value: observation.magnitudeValue,
                unit: observation.magnitudeUnit ?? '',
              })

        return (
          <Group
            key={`${observation.date}-${index}`}
            gap="sm"
            wrap="nowrap"
            align="flex-start"
          >
            <span
              style={{
                width: 10,
                height: 10,
                marginTop: 6,
                borderRadius: 999,
                background: color,
                flexShrink: 0,
              }}
            />
            <Stack gap={2} style={{ minWidth: 0 }}>
              <Text size="sm" fw={500}>
                {formatUtc(observation.date)}
              </Text>
              <Text size="xs" c="dimmed">
                {location}
                {magnitude ? ` · ${magnitude}` : ''}
              </Text>
            </Stack>
          </Group>
        )
      })}
    </Stack>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
      {children}
    </Text>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={2}>
      <SectionLabel>{label}</SectionLabel>
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

function formatMagnitude(
  magnitude: { value: number; unit: string } | null,
): string {
  if (!magnitude) {
    return '—'
  }

  const value = Number.isInteger(magnitude.value)
    ? String(magnitude.value)
    : magnitude.value.toLocaleString('en-US', { maximumFractionDigits: 2 })

  return magnitude.unit ? `${value} ${magnitude.unit}` : value
}
