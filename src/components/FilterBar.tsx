import {
  Badge,
  Group,
  Paper,
  SegmentedControl,
  Skeleton,
  TextInput,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import type { Category } from '../types/category'
import type { DaysFilter, EventFilters, StatusFilter } from '../types/filter'
import { CategoryFilter } from './CategoryFilter'
import classes from './FilterBar.module.css'

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

  return (
    <Paper withBorder p="sm" radius="md" className={classes.root}>
      <Group align="center" wrap="wrap" gap="sm">
        {mode === 'explorer' && (
          <TextInput
            className={classes.search}
            placeholder="Search events or locations..."
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            size="sm"
          />
        )}

        {mode === 'explorer' &&
          (categoriesLoading ? (
            <Skeleton height={36} width={180} radius="md" />
          ) : (
            <CategoryFilter
              categories={categories}
              value={filters.categories}
              onChange={(value) => onChange({ categories: value })}
            />
          ))}

        <SegmentedControl
          size="xs"
          color="navy"
          aria-label="Status"
          value={filters.status}
          onChange={(value) => onChange({ status: value as StatusFilter })}
          data={[
            { label: 'Active', value: 'open' },
            { label: 'Closed', value: 'closed' },
            { label: 'All', value: 'all' },
          ]}
        />

        <SegmentedControl
          size="xs"
          color="navy"
          aria-label="Time range"
          value={String(filters.days)}
          onChange={(value) => onChange({ days: Number(value) as DaysFilter })}
          data={[
            { label: '7 days', value: '7' },
            { label: '30 days', value: '30' },
            ...(mode === 'explorer'
              ? [{ label: '90 days', value: '90' as const }]
              : []),
          ]}
        />

        {eventsLoading ? (
          <Skeleton
            height={22}
            width={88}
            radius="xl"
            className={classes.count}
          />
        ) : (
          <Badge
            variant="light"
            color="navy"
            size="lg"
            radius="xl"
            className={classes.count}
          >
            {eventCount?.toLocaleString() ?? '—'} events
          </Badge>
        )}
      </Group>
    </Paper>
  )
}
