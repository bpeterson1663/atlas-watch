import { Button } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import { DASHBOARD_EVENT_LIMIT } from '../lib/constants'

interface Props {
  total: number
}

export function ViewMoreEventsLink({ total }: Props) {
  const location = useLocation()

  if (total <= DASHBOARD_EVENT_LIMIT) {
    return null
  }

  return (
    <Button
      component={Link}
      to={{ pathname: '/explorer', search: location.search }}
      variant="light"
      color="navy"
      fullWidth
      rightSection={<IconArrowRight size={16} />}
      mt="sm"
    >
      View all {total.toLocaleString()} events in Event Explorer
    </Button>
  )
}
