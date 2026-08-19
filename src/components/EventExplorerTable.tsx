import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Pagination,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconDotsVertical } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { EventView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { formatUtc } from '../lib/date'
import { EXPLORER_PAGE_SIZE } from '../lib/constants'
import classes from './EventExplorerTable.module.css'

interface Props {
  events: EventView[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function EventExplorerTable({ events, selectedId, onSelect }: Props) {
  const location = useLocation()
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [events])

  const totalPages = Math.max(1, Math.ceil(events.length / EXPLORER_PAGE_SIZE))

  const pageEvents = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * EXPLORER_PAGE_SIZE
    return events.slice(start, start + EXPLORER_PAGE_SIZE)
  }, [events, page, totalPages])

  const rangeStart =
    events.length === 0 ? 0 : (page - 1) * EXPLORER_PAGE_SIZE + 1
  const rangeEnd = Math.min(page * EXPLORER_PAGE_SIZE, events.length)

  return (
    <Stack gap="sm" flex={1} mih={0}>
      <Group
        justify="space-between"
        wrap="wrap"
        gap="sm"
        className={classes.toolbar}
      >
        <Group gap="md" wrap="wrap">
          <Text size="sm" fw={600}>
            {events.length.toLocaleString()} events found
          </Text>
          <Text size="xs" c="dimmed">
            All times in UTC
          </Text>
        </Group>
      </Group>

      <div className={classes.tableWrap}>
        <Table highlightOnHover stickyHeader verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Event Name</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Latest Observation</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Sources</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th w={40} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pageEvents.map((event) => {
              const { color, icon: Icon } = categoryStyle(event.categoryId)
              const selected = event.id === selectedId

              return (
                <Table.Tr
                  key={event.id}
                  className={`${classes.clickableRow}${selected ? ` ${classes.selectedRow}` : ''}`}
                  onClick={() => onSelect(event.id)}
                >
                  <Table.Td className={classes.eventNameCell}>
                    <Group wrap="nowrap" gap="sm" align="flex-start">
                      <ThemeIcon
                        size={36}
                        radius="md"
                        color={color}
                        variant="light"
                      >
                        <Icon size={18} />
                      </ThemeIcon>
                      <Stack gap={2}>
                        <Text size="sm" fw={600} lineClamp={2}>
                          {event.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ID: {event.id}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="sm" color={color} variant="light">
                      {event.categoryTitle}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatUtc(event.lastDate)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6} wrap="nowrap">
                      <Text
                        component="span"
                        aria-hidden
                        c={event.isOpen ? 'green' : 'gray'}
                      >
                        ●
                      </Text>
                      <Text size="sm">
                        {event.isOpen ? 'Active' : 'Closed'}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{event.sourceCount}</Text>
                  </Table.Td>
                  <Table.Td className={classes.locationCell}>
                    <Text size="sm" lineClamp={2}>
                      {event.locationLabel}
                    </Text>
                  </Table.Td>
                  <Table.Td
                    onClick={(clickEvent) => clickEvent.stopPropagation()}
                  >
                    <Menu position="bottom-end" withinPortal>
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          aria-label="Event actions"
                        >
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          component={Link}
                          to={{
                            pathname: `/events/${encodeURIComponent(event.id)}`,
                            search: location.search,
                          }}
                        >
                          View full details
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </div>

      <Group
        justify="space-between"
        wrap="wrap"
        gap="sm"
        className={classes.toolbar}
      >
        <Text size="sm" c="dimmed">
          Rows per page: {EXPLORER_PAGE_SIZE}
        </Text>
        <Group gap="md" wrap="wrap">
          <Text size="sm" c="dimmed">
            {rangeStart}-{rangeEnd} of {events.length.toLocaleString()}
          </Text>
          <Pagination
            total={totalPages}
            value={Math.min(page, totalPages)}
            onChange={setPage}
            size="sm"
          />
        </Group>
      </Group>
    </Stack>
  )
}
