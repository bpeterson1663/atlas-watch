import { Group, ScrollArea, Skeleton, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { EventList } from './EventList'
import { EventMap } from './EventMap'
import { MapPane } from './MapPane'
import { ViewMoreEventsLink } from './ViewMoreEventsLink'
import type { EventView } from '../types/event'
import type { Status } from '../types/status'

const MOBILE_MAP_HEIGHT = 280

interface Props {
  listViews: EventView[]
  mapViews: EventView[]
  totalCount: number
  status: Status
  message: string
}

export function DashboardEventsSection({
  listViews,
  mapViews,
  totalCount,
  status,
  message,
}: Props) {
  const isDesktop = useMediaQuery('(min-width: 62em)')
  const isInitialLoad =
    status === 'loading' && listViews.length === 0 && totalCount === 0
  const isRefreshing = status === 'refreshing'
  const showSkeleton = isInitialLoad || isRefreshing

  if (status === 'error') {
    return <p>Error loading events: {message}</p>
  }

  const mapContent = showSkeleton ? (
    <Skeleton height="100%" />
  ) : (
    <EventMap events={mapViews} interactive={false} />
  )

  const listContent = showSkeleton ? (
    <>
      <Skeleton height={64} mb={6} />
      <Skeleton height={64} mb={6} />
      <Skeleton height={64} />
    </>
  ) : (
    <>
      <EventList events={listViews} />
      <ViewMoreEventsLink total={totalCount} />
    </>
  )

  if (isDesktop) {
    return (
      <Group align="stretch" wrap="nowrap" flex={1} mih={0} gap="md">
        <MapPane flex={2}>{mapContent}</MapPane>
        <ScrollArea flex={1} h="100%" miw={280} type="hover">
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
