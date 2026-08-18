import { Text } from '@mantine/core'
import { DASHBOARD_EVENT_LIMIT } from '../lib/constants'

interface Props {
  shown: number
  total: number
}

export function EventsLimitNotice({ shown, total }: Props) {
  if (total <= shown) {
    return null
  }

  return (
    <Text size="sm" c="dimmed" ta="center" py="xs">
      Showing {shown} of {total.toLocaleString()} events (most recent{' '}
      {DASHBOARD_EVENT_LIMIT}).
    </Text>
  )
}
