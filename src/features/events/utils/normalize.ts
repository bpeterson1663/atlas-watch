import type {
  EonetEvent,
  EonetGeometry,
  EventView,
} from '../../../shared/types/event'

export function normalizeEvent(event: EonetEvent): EventView {
  const last = event.geometry[event.geometry.length - 1]
  const comma = event.title.indexOf(',')
  const fromTitle = comma !== -1 ? event.title.slice(comma + 1).trim() : ''

  const point = pointFromGeometry(last)

  return {
    id: event.id,
    title: event.title,
    categoryId: event.categories[0]?.id ?? 'unknown',
    categoryTitle: event.categories[0]?.title ?? 'Unknown',
    isOpen: event.closed == null,
    lastDate: last?.date ?? '',
    lastLat: point?.lat ?? null,
    lastLng: point?.lng ?? null,
    locationLabel:
      fromTitle || formatCoordinates(last) || 'Location unavailable',
  }
}

export function normalizeEvents(events: EonetEvent[]): EventView[] {
  return events
    .map(normalizeEvent)
    .sort((a, b) => b.lastDate.localeCompare(a.lastDate))
}

function formatCoordinates(geometry: EonetGeometry | undefined): string | null {
  const point = pointFromGeometry(geometry)
  if (point == null) {
    return null
  }

  const { lat, lng } = point
  return `${formatHemisphere(lat, 'N', 'S')}, ${formatHemisphere(lng, 'E', 'W')}`
}

function formatHemisphere(
  value: number,
  positive: string,
  negative: string,
): string {
  const hemi = value >= 0 ? positive : negative
  return `${Math.abs(value).toFixed(2)}°${hemi}`
}

function pointFromGeometry(
  geometry: EonetGeometry | undefined,
): { lat: number; lng: number } | null {
  if (!geometry) {
    return null
  }

  if (geometry.type === 'Point' && isLngLat(geometry.coordinates)) {
    const [lng, lat] = geometry.coordinates
    return { lat, lng }
  }

  if (geometry.type === 'Polygon') {
    const ring = geometry.coordinates[0]
    if (!Array.isArray(ring)) {
      return null
    }

    const first = ring[0]
    if (isLngLat(first)) {
      const [lng, lat] = first
      return { lat, lng }
    }
  }

  return null
}

function isLngLat(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number'
  )
}
