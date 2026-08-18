import { Group, ScrollArea, Skeleton, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { EventList } from './EventList'
import { EventMap } from './EventMap'
import { EventsLimitNotice } from './EventsLimitNotice'
import { MapPane } from './MapPane'
import type { EventView } from '../types/event'
import type { Status } from '../types/status'

const MOBILE_MAP_HEIGHT = 280

interface Props {
  views: EventView[]
  totalCount: number
  status: Status
  message: string
}

export function EventsSection({ views, totalCount, status, message }: Props) {
  const isDesktop = useMediaQuery('(min-width: 62em)')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const isInitialLoad = status === 'loading' && views.length === 0 && totalCount === 0
  const isRefreshing = status === 'refreshing'
  const showSkeleton = isInitialLoad || isRefreshing

  useEffect(() => {
    setSelectedId(null)
  }, [views])

  useEffect(() => {
    if (selectedId && !views.some((event) => event.id === selectedId)) {
      setSelectedId(null)
    }
  }, [views, selectedId])

  if (status === 'error') {
    return <p>Error loading events: {message}</p>
  }

  const mapContent = showSkeleton ? (
    <Skeleton height="100%" />
  ) : (
    <EventMap events={views} selectedId={selectedId} onSelect={setSelectedId} />
  )

  const listContent = showSkeleton ? (
    <>
      <Skeleton height={88} mb="sm" />
      <Skeleton height={88} mb="sm" />
      <Skeleton height={88} />
    </>
  ) : (
    <>
      <EventList
        events={views}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <EventsLimitNotice shown={views.length} total={totalCount} />
    </>
  )

  if (isDesktop) {
    return (
      <Group align="stretch" grow wrap="nowrap" flex={1} mih={0}>
        <MapPane>{mapContent}</MapPane>
        <ScrollArea flex={1} h="100%" type="hover">
          {listContent}
        </ScrollArea>
      </Group>
    )
  }

  return (
    <Stack gap="md" flex={1} mih={0}>
      <MapPane fixedHeight={MOBILE_MAP_HEIGHT}>{mapContent}</MapPane>
      <ScrollArea flex={1} mih={240} type="hover">
        {listContent}
      </ScrollArea>
    </Stack>
  )
}
