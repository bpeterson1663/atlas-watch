import {
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import type { ReactNode } from 'react'
import { IconActivity, IconAntenna } from '@tabler/icons-react'
import type { DashboardSummary } from '../lib/summary'
import { summaryEventSubtext } from '../lib/summary'
import { categoryStyle } from '../lib/category'
import type { EventFilters } from '../types/filter'
import classes from './SummaryCards.module.css'

interface Props {
  summary: DashboardSummary
  filters: Pick<EventFilters, 'days' | 'status'>
  loading?: boolean
}

export function SummaryCards({ summary, filters, loading = false }: Props) {
  if (loading) {
    return (
      <SimpleGrid
        cols={{ base: 1, sm: 3 }}
        spacing="md"
        className={classes.root}
      >
        <Skeleton height={88} radius="md" />
        <Skeleton height={88} radius="md" />
        <Skeleton height={88} radius="md" />
      </SimpleGrid>
    )
  }

  const topCategory = summary.topCategory
  const topStyle = topCategory
    ? categoryStyle(topCategory.id)
    : categoryStyle('unknown')
  const TopIcon = topStyle.icon

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" className={classes.root}>
      <SummaryCard
        icon={
          <div className={`${classes.iconWrap} ${classes.iconWrapEvents}`}>
            <IconActivity size={22} stroke={1.8} />
          </div>
        }
        label="Events shown"
        value={String(summary.eventCount)}
        detail={summaryEventSubtext(summary, filters)}
      />
      <SummaryCard
        icon={
          <ThemeIcon
            size={44}
            radius="md"
            color={topStyle.color}
            variant="light"
            className={classes.iconWrapCategory}
          >
            <TopIcon size={22} />
          </ThemeIcon>
        }
        label="Top category"
        value={topCategory?.title ?? '—'}
        detail={
          topCategory
            ? `${topCategory.count} events (${topCategory.share}%)`
            : 'No events in this view'
        }
      />
      <SummaryCard
        icon={
          <div className={`${classes.iconWrap} ${classes.iconWrapSources}`}>
            <IconAntenna size={22} stroke={1.8} />
          </div>
        }
        label="Sources"
        value={String(summary.sourceCount)}
        detail="via NASA EONET"
      />
    </SimpleGrid>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  detail: string
  value: string
}) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group wrap="nowrap" align="flex-start" gap="md">
        {icon}
        <Stack gap={2}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {label}
          </Text>
          <Text size="xl" fw={700} lh={1.1}>
            {value}
          </Text>
          <Text size="sm" c="dimmed">
            {detail}
          </Text>
        </Stack>
      </Group>
    </Paper>
  )
}
