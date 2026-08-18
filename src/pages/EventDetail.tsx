import {
  Anchor,
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
import { MapPane } from '../components/MapPane'
import { useEvent } from '../hooks/useEvent'
import { locatedObservations } from '../lib/observation'
import { normalizeEventDetail } from '../lib/normalize'

const MOBILE_MAP_HEIGHT = 280

export function EventDetail() {
  const { eventId } = useParams()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 62em)')
  const { event, status, message } = useEvent(eventId)

  const backTo = { pathname: '/', search: location.search }

  if (status === 'loading') {
    return (
      <DetailLayout backTo={backTo} isDesktop={isDesktop}>
        {isDesktop ? (
          <Group align="stretch" grow wrap="nowrap" flex={1} mih={0}>
            <Skeleton
              height="100%"
              mih={MOBILE_MAP_HEIGHT}
              radius="md"
              flex={2}
            />
            <Skeleton
              height="100%"
              mih={MOBILE_MAP_HEIGHT}
              radius="md"
              flex={1}
            />
          </Group>
        ) : (
          <Stack gap="md" flex={1} mih={0}>
            <Skeleton height={MOBILE_MAP_HEIGHT} radius="md" />
            <Skeleton height={240} radius="md" />
          </Stack>
        )}
      </DetailLayout>
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
      <EventTrackMap
        observations={view.observations}
        categoryId={view.categoryId}
      />
    )

  return (
    <DetailLayout backTo={backTo} isDesktop={isDesktop}>
      {isDesktop ? (
        <Group align="stretch" grow wrap="nowrap" flex={1} mih={0}>
          <MapPane>{mapContent}</MapPane>
          <ScrollArea flex={1} h="100%" type="hover">
            <EventDetailPanel event={view} />
          </ScrollArea>
        </Group>
      ) : (
        <Stack gap="md" flex={1} mih={0}>
          <MapPane fixedHeight={MOBILE_MAP_HEIGHT}>{mapContent}</MapPane>
          <ScrollArea flex={1} mih={240} type="hover">
            <EventDetailPanel event={view} />
          </ScrollArea>
        </Stack>
      )}
    </DetailLayout>
  )
}

function DetailLayout({
  backTo,
  isDesktop,
  children,
}: {
  backTo: { pathname: string; search: string }
  isDesktop: boolean | undefined
  children: ReactNode
}) {
  return (
    <Stack
      gap="md"
      flex={1}
      h={isDesktop ? 'calc(100vh - 104px)' : 'auto'}
      mih={0}
    >
      <BackLink to={backTo} />
      {children}
    </Stack>
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
