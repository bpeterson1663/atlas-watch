import type { EonetEvent, EventView } from '../types/event'
import type { EventFilters } from '../types/filter'

export interface DashboardSummary {
  eventCount: number
  openCount: number
  closedCount: number
  topCategory: {
    id: string
    title: string
    count: number
    share: number
  } | null
  sourceCount: number
}

export function buildDashboardSummary(
  views: EventView[],
  events: EonetEvent[],
): DashboardSummary {
  const viewIds = new Set(views.map((view) => view.id))
  const matchedEvents = events.filter((event) => viewIds.has(event.id))

  const openCount = views.filter((view) => view.isOpen).length
  const closedCount = views.length - openCount

  const sourceIds = new Set<string>()
  for (const event of matchedEvents) {
    for (const source of event.sources ?? []) {
      sourceIds.add(source.id)
    }
  }

  return {
    eventCount: views.length,
    openCount,
    closedCount,
    topCategory: topCategory(views),
    sourceCount: sourceIds.size,
  }
}

function topCategory(views: EventView[]): DashboardSummary['topCategory'] {
  if (views.length === 0) {
    return null
  }

  const counts = new Map<string, { title: string; count: number }>()

  for (const view of views) {
    const current = counts.get(view.categoryId)
    if (current) {
      current.count++
    } else {
      counts.set(view.categoryId, {
        title: view.categoryTitle,
        count: 1,
      })
    }
  }

  let best: { id: string; title: string; count: number } | null = null

  for (const [id, entry] of counts) {
    if (best == null || entry.count > best.count) {
      best = { id, title: entry.title, count: entry.count }
    }
  }

  if (best == null) {
    return null
  }

  return {
    id: best.id,
    title: best.title,
    count: best.count,
    share: Math.round((best.count / views.length) * 100),
  }
}

export function summaryEventSubtext(
  summary: DashboardSummary,
  filters: Pick<EventFilters, 'days' | 'status'>,
): string {
  const days = `Last ${filters.days} days`

  if (filters.status === 'open') {
    return days
  }

  if (filters.status === 'closed') {
    return days
  }

  if (summary.openCount === 0 || summary.closedCount === 0) {
    return days
  }

  return `${summary.openCount} open · ${summary.closedCount} closed`
}
