import { Anchor, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useEvent } from '../hooks/useEvent'
import { normalizeEventDetail } from '../lib/normalize'
import { EventDetailPanel } from '../components/EventDetailPanel'

export function EventDetail() {
  const { eventId } = useParams()
  const location = useLocation()
  const { event, status, message } = useEvent(eventId)

  const backTo = { pathname: '/', search: location.search }

  if (status === 'loading') {
    return (
      <Stack gap="md">
        <BackLink to={backTo} />
        <Skeleton height={160} radius="md" />
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

  return (
    <Stack gap="md">
      <BackLink to={backTo} />
      <EventDetailPanel event={view} />
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
