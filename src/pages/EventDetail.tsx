import { Anchor, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useEvent } from '../hooks/useEvent'

export function EventDetail() {
  const { eventId } = useParams()
  const location = useLocation()
  const { event, status, message } = useEvent(eventId)

  const backTo = { pathname: '/', search: location.search }

  if (status === 'loading') {
    return (
      <Stack gap="md">
        <BackLink to={backTo} />
        <Skeleton height={28} width={280} />
        <Skeleton height={16} width={180} />
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

  return (
    <Stack gap="md">
      <BackLink to={backTo} />
      <Title order={3}>{event.title}</Title>
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
