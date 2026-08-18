import {
  Anchor,
  Box,
  Center,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowLeft } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { EventDetailPanel } from '../components/EventDetailPanel'
import { EventTrackMap } from '../components/EventTrackMap'
import { useEvent } from '../hooks/useEvent'
import { locatedObservations } from '../lib/observation'
import { normalizeEventDetail } from '../lib/normalize'

export function EventDetail() {
  const { eventId } = useParams()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 62em)', true)
  const { event, status, message } = useEvent(eventId)

  const backTo = { pathname: '/', search: location.search }

  if (status === 'loading') {
    return (
      <Stack
        gap="md"
        flex={1}
        h={{ base: 'auto', md: 'calc(100vh - 104px)' }}
        style={{ minHeight: 0 }}
      >
        <BackLink to={backTo} />
        <Group
          align="stretch"
          grow
          wrap="nowrap"
          flex={1}
          style={{ minHeight: 0 }}
        >
          <Skeleton height="100%" mih={280} radius="md" />
          <Skeleton height="100%" mih={280} radius="md" visibleFrom="md" />
        </Group>
      </Stack>
    )
  }

  if (status === 'error' || !event) {
    return (
      <Stack gap="md">
        <BackLink to={backTo} />
        <Title order={3}>Event not found</Title>
        <Text c="dimmed">{message}</Text>
      </Stack>
    )
  }

  const view = normalizeEventDetail(event)
  const points = locatedObservations(view.observations)

  const mapContent =
    points.length === 0 ? (
      <Center h="100%">
        <Text c="dimmed">Location unavailable</Text>
      </Center>
    ) : (
      <EventTrackMap observations={view.observations} />
    )

  const panel = (
    <ScrollArea h="100%" type="hover">
      <EventDetailPanel event={view} />
    </ScrollArea>
  )

  return (
    <Stack
      gap="md"
      flex={1}
      h={{ base: 'auto', md: 'calc(100vh - 104px)' }}
      style={{ minHeight: 0 }}
    >
      <BackLink to={backTo} />
      {isDesktop ? (
        <Group
          align="stretch"
          grow
          wrap="nowrap"
          flex={1}
          style={{ minHeight: 0 }}
        >
          <MapPane>{mapContent}</MapPane>
          {panel}
        </Group>
      ) : (
        <Stack gap="md" flex={1} style={{ minHeight: 0 }}>
          <MapPane h={280}>{mapContent}</MapPane>
          {panel}
        </Stack>
      )}
    </Stack>
  )
}

function MapPane({
  children,
  h = '100%',
}: {
  children: ReactNode
  h?: number | string
}) {
  return (
    <Box
      flex={2}
      h={h}
      style={{
        borderRadius: 8,
        overflow: 'hidden',
        minHeight: 0,
        border: '1px solid var(--mantine-color-gray-3)',
      }}
    >
      {children}
    </Box>
  )
}

function BackLink({ to }: { to: { pathname: string; search: string } }) {
  return (
    <Anchor component={Link} to={to} size="sm">
      <Group gap={6} wrap="nowrap">
        <IconArrowLeft size={14} />
        Back to results
      </Group>
    </Anchor>
  )
}
