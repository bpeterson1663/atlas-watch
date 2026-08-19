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
  UnstyledButton,
} from '@mantine/core'
import {
  IconChevronDown,
  IconChevronUp,
  IconDotsVertical,
  IconSelector,
} from '@tabler/icons-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { EventView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { formatUtc } from '../lib/date'
import { EXPLORER_PAGE_SIZE } from '../lib/constants'
import classes from './EventExplorerTable.module.css'

type SortKey =
  | 'title'
  | 'categoryTitle'
  | 'lastDate'
  | 'status'
  | 'sourceCount'
  | 'locationLabel'

interface Props {
  events: EventView[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function EventExplorerTable({ events, selectedId, onSelect }: Props) {
  const location = useLocation()
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortKey>('lastDate')
  const [reversed, setReversed] = useState(true)

  useEffect(() => {
    setPage(1)
  }, [events])

  const sortedEvents = useMemo(
    () => sortEvents(events, sortBy, reversed),
    [events, reversed, sortBy],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(sortedEvents.length / EXPLORER_PAGE_SIZE),
  )

  const pageEvents = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * EXPLORER_PAGE_SIZE
    return sortedEvents.slice(start, start + EXPLORER_PAGE_SIZE)
  }, [page, sortedEvents, totalPages])

  const rangeStart =
    sortedEvents.length === 0 ? 0 : (page - 1) * EXPLORER_PAGE_SIZE + 1
  const rangeEnd = Math.min(page * EXPLORER_PAGE_SIZE, sortedEvents.length)

  function toggleSort(key: SortKey) {
    setPage(1)
    if (sortBy === key) {
      setReversed((current) => !current)
      return
    }
    setSortBy(key)
    setReversed(false)
  }

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
            {sortedEvents.length.toLocaleString()} events found
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
              <SortableTh
                sorted={sortBy === 'title'}
                reversed={reversed}
                onSort={() => toggleSort('title')}
              >
                Event Name
              </SortableTh>
              <SortableTh
                sorted={sortBy === 'categoryTitle'}
                reversed={reversed}
                onSort={() => toggleSort('categoryTitle')}
              >
                Category
              </SortableTh>
              <SortableTh
                sorted={sortBy === 'lastDate'}
                reversed={reversed}
                onSort={() => toggleSort('lastDate')}
              >
                Latest Observation
              </SortableTh>
              <SortableTh
                sorted={sortBy === 'status'}
                reversed={reversed}
                onSort={() => toggleSort('status')}
              >
                Status
              </SortableTh>
              <SortableTh
                sorted={sortBy === 'sourceCount'}
                reversed={reversed}
                onSort={() => toggleSort('sourceCount')}
              >
                Sources
              </SortableTh>
              <SortableTh
                sorted={sortBy === 'locationLabel'}
                reversed={reversed}
                onSort={() => toggleSort('locationLabel')}
              >
                Location
              </SortableTh>
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
            {rangeStart}-{rangeEnd} of {sortedEvents.length.toLocaleString()}
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

function SortableTh({
  children,
  sorted,
  reversed,
  onSort,
}: {
  children: ReactNode
  sorted: boolean
  reversed: boolean
  onSort: () => void
}) {
  const Icon = sorted
    ? reversed
      ? IconChevronDown
      : IconChevronUp
    : IconSelector

  return (
    <Table.Th
      className={classes.sortTh}
      aria-sort={sorted ? (reversed ? 'descending' : 'ascending') : 'none'}
    >
      <UnstyledButton className={classes.sortControl} onClick={onSort}>
        <Group gap={6} wrap="nowrap" justify="space-between">
          <span>{children}</span>
          <Icon size={14} stroke={1.5} aria-hidden />
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}

function sortEvents(
  events: EventView[],
  sortBy: SortKey,
  reversed: boolean,
): EventView[] {
  return [...events].sort((a, b) => {
    const result = compareEvents(a, b, sortBy)
    const directed = reversed ? -result : result
    return directed !== 0 ? directed : a.id.localeCompare(b.id)
  })
}

function compareEvents(a: EventView, b: EventView, sortBy: SortKey): number {
  switch (sortBy) {
    case 'title':
      return a.title.localeCompare(b.title)
    case 'categoryTitle':
      return a.categoryTitle.localeCompare(b.categoryTitle)
    case 'lastDate':
      return a.lastDate.localeCompare(b.lastDate)
    case 'status':
      return statusLabel(a).localeCompare(statusLabel(b))
    case 'sourceCount':
      return a.sourceCount - b.sourceCount
    case 'locationLabel':
      return a.locationLabel.localeCompare(b.locationLabel)
  }
}

function statusLabel(event: EventView): string {
  return event.isOpen ? 'Active' : 'Closed'
}
