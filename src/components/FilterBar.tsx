import {
  Group,
  MultiSelect,
  Paper,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch, IconWorld } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import type { Category } from '../types/category'
import type { DaysFilter, EventFilters, StatusFilter } from '../types/filter'
import layout from '../styles/layout.module.css'

const SEARCH_DEBOUNCE_MS = 300

interface Props {
  mode: 'dashboard' | 'explorer'
  categories?: Category[]
  categoriesLoading?: boolean
  filters: EventFilters
  eventCount?: number
  eventsLoading?: boolean
  onChange: (partial: Partial<EventFilters>) => void
}

export function FilterBar({
  mode,
  categories = [],
  categoriesLoading = false,
  filters,
  eventCount,
  eventsLoading = false,
  onChange,
}: Props) {
  const [query, setQuery] = useState(filters.q)
  const [debouncedQuery] = useDebouncedValue(query, SEARCH_DEBOUNCE_MS)
  const lastEmittedQuery = useRef(filters.q)

  useEffect(() => {
    if (filters.q !== lastEmittedQuery.current) {
      lastEmittedQuery.current = filters.q
      setQuery(filters.q)
    }
  }, [filters.q])

  useEffect(() => {
    if (debouncedQuery === lastEmittedQuery.current) {
      return
    }
    lastEmittedQuery.current = debouncedQuery
    onChange({ q: debouncedQuery })
  }, [debouncedQuery, onChange])

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.title,
  }))

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="sm">
        <Group align="flex-end" wrap="wrap" gap="sm">
          {mode === 'explorer' && (
            <TextInput
              className={layout.searchInput}
              placeholder="Search events or locations..."
              leftSection={<IconSearch size={16} />}
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          )}

          <Group gap="xs" wrap="nowrap">
            <Text size="xs" c="dimmed">
              Status
            </Text>
            <SegmentedControl
              size="xs"
              color="navy"
              value={filters.status}
              onChange={(value) => onChange({ status: value as StatusFilter })}
              data={[
                { label: 'Active', value: 'open' },
                { label: 'Closed', value: 'closed' },
                { label: 'All', value: 'all' },
              ]}
            />
          </Group>

          <Group gap="xs" wrap="nowrap">
            <Text size="xs" c="dimmed">
              Time range
            </Text>
            <SegmentedControl
              size="xs"
              color="navy"
              value={String(filters.days)}
              onChange={(value) =>
                onChange({ days: Number(value) as DaysFilter })
              }
              data={[
                { label: '7 days', value: '7' },
                { label: '30 days', value: '30' },
                ...(mode === 'explorer'
                  ? [{ label: '90 days', value: '90' as const }]
                  : []),
              ]}
            />
          </Group>
        </Group>

        {mode === 'explorer' && (
          <Group gap="xs" align="center" wrap="wrap">
            {categoriesLoading ? (
              <Skeleton height={36} w={320} radius="md" />
            ) : (
              <MultiSelect
                placeholder="Select categories"
                data={categoryOptions}
                value={filters.categories}
                onChange={(value) => onChange({ categories: value })}
                leftSection={<IconWorld size={16} />}
                searchable
                clearable
                maxDropdownHeight={280}
                w={{ base: '100%' }}
                comboboxProps={{ zIndex: 1000 }}
              />
            )}
          </Group>
        )}

        <Group gap="xs" align="center" wrap="wrap">
          {eventsLoading ? (
            <Skeleton height={20} width={80} />
          ) : (
            <Text size="sm" fw={600} c="navy" className={layout.noWrap}>
              {eventCount ?? '—'} events
            </Text>
          )}
        </Group>
      </Stack>
    </Paper>
  )
}
