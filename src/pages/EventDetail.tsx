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
import { useNavigate, useParams } from 'react-router-dom'
import { EventDetailPanel } from '../components/EventDetailPanel'
import { EventTrackMap } from '../components/EventTrackMap'
import { MapPane } from '../components/MapPane'
import { useEvent } from '../hooks/useEvent'
import { locatedObservations } from '../lib/observation'
import { normalizeEventDetail } from '../lib/normalize'

const MOBILE_MAP_HEIGHT = 280

export function EventDetail() {
  const { eventId } = useParams()
  const isDesktop = useMediaQuery('(min-width: 62em)')
  const { event, status, message } = useEvent(eventId)

  if (status === 'loading') {
    return (
      <DetailLayout isDesktop={isDesktop}>
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
        <BackLink />
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
    <DetailLayout isDesktop={isDesktop}>
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
  isDesktop,
  children,
}: {
  isDesktop: boolean | undefined
  children: ReactNode
}) {
  return (
    <Stack
      gap="md"
      flex={1}
      h={isDesktop ? 'calc(100vh - 88px)' : 'auto'}
      mih={0}
    >
      <BackLink />
      {children}
    </Stack>
  )
}

function BackLink() {
  const navigate = useNavigate()

  return (
    <Anchor
      component="button"
      type="button"
      size="sm"
      onClick={() => navigate(-1)}
    >
      <Group gap={6} wrap="nowrap">
        <IconArrowLeft size={14} />
        Back
      </Group>
    </Anchor>
  )
}
