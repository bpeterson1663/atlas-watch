import { Group, Skeleton, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { EventExplorerTable } from './EventExplorerTable'
import { EventMap } from './EventMap'
import { ExplorerSelectionPanel } from './ExplorerSelectionPanel'
import { MapPane } from './MapPane'
import type { EventView } from '../types/event'
import type { Status } from '../types/status'

const MOBILE_MAP_HEIGHT = 280
const DESKTOP_MAP_MIN_HEIGHT = 320

interface Props {
  views: EventView[]
  status: Status
  message: string
}

export function ExplorerEventsSection({ views, status, message }: Props) {
  const isDesktop = useMediaQuery('(min-width: 62em)')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const isInitialLoad = status === 'loading' && views.length === 0
  const isRefreshing = status === 'refreshing'
  const showSkeleton = isInitialLoad || isRefreshing

  const selected = views.find((event) => event.id === selectedId)

  useEffect(() => {
    if (selectedId && !views.some((event) => event.id === selectedId)) {
      setSelectedId(null)
    }
  }, [views, selectedId])

  if (status === 'error') {
    return <p>Error loading events: {message}</p>
  }

  if (showSkeleton) {
    return (
      <Stack gap="md" flex={1}>
        <Skeleton height={28} width={180} />
        <Skeleton height={320} />
        <Skeleton height={40} />
      </Stack>
    )
  }

  const sidebar = (
    <Stack
      gap="md"
      flex={1}
      mih={0}
      w={{ base: '100%', md: 380 }}
      miw={{ md: 320 }}
    >
      <MapPane
        flex={1}
        fixedHeight={isDesktop ? undefined : MOBILE_MAP_HEIGHT}
        minHeight={isDesktop ? DESKTOP_MAP_MIN_HEIGHT : undefined}
      >
        <EventMap
          events={views}
          interactive
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </MapPane>
      {selected ? (
        <ExplorerSelectionPanel event={selected} />
      ) : (
        <Text size="sm" c="dimmed">
          Select an event to preview details.
        </Text>
      )}
    </Stack>
  )

  const table = (
    <EventExplorerTable
      events={views}
      selectedId={selectedId}
      onSelect={setSelectedId}
    />
  )

  if (isDesktop) {
    return (
      <Group align="stretch" wrap="nowrap" flex={1} mih={0} gap="md">
        <Stack flex={1} mih={0} miw={0}>
          {table}
        </Stack>
        {sidebar}
      </Group>
    )
  }

  return (
    <Stack gap="md" flex={1} mih={0}>
      {table}
      {sidebar}
    </Stack>
  )
}
