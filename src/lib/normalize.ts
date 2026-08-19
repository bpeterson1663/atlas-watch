import type {
  EonetEvent,
  EonetGeometry,
  EventDetailView,
  EventObservation,
  EventView,
} from '../types/event'
import { latLngFromGeometry, latLngsFromPolygonRing } from './coordinates'
import { formatLatLng } from './observation'

export function normalizeEvent(event: EonetEvent): EventView {
  const geometry = sortedGeometry(event.geometry)
  const last = geometry[geometry.length - 1]
  const point = latLngFromGeometry(last)

  return {
    id: event.id,
    title: event.title,
    description: event.description?.trim() || null,
    categoryId: event.categories[0]?.id ?? 'unknown',
    categoryTitle: event.categories[0]?.title ?? 'Unknown',
    isOpen: event.closed == null,
    firstDate: geometry[0]?.date ?? '',
    lastDate: last?.date ?? '',
    lastLat: point?.lat ?? null,
    lastLng: point?.lng ?? null,
    locationLabel:
      placeFromTitle(event.title) ||
      formatGeometryLocation(last) ||
      'Location unavailable',
    geometryCount: event.geometry.length,
    sourceCount: event.sources?.length ?? 0,
  }
}

export function normalizeEvents(events: EonetEvent[]): EventView[] {
  return events
    .map(normalizeEvent)
    .sort((a, b) => b.lastDate.localeCompare(a.lastDate))
}

export function normalizeEventDetail(event: EonetEvent): EventDetailView {
  const observations: EventObservation[] = sortedGeometry(event.geometry)
    .map((geometry) => {
      const point = latLngFromGeometry(geometry)
      const magnitudeValue = Number.isFinite(geometry.magnitudeValue)
        ? geometry.magnitudeValue
        : null

      return {
        date: geometry.date ?? '',
        lat: point?.lat ?? null,
        lng: point?.lng ?? null,
        magnitudeValue,
        magnitudeUnit: geometry.magnitudeUnit,
        polygon: polygonFromGeometry(geometry),
      }
    })

  return {
    id: event.id,
    title: event.title,
    description: event.description?.trim() || null,
    categoryId: event.categories[0]?.id ?? 'unknown',
    categoryTitle: event.categories[0]?.title ?? 'Unknown',
    isOpen: event.closed == null,
    firstDate: observations[0]?.date ?? '',
    lastDate: observations[observations.length - 1]?.date ?? '',
    observations,
    sources: event.sources ?? [],
    maxMagnitude: maxMagnitude(observations),
  }
}

function sortedGeometry(geometry: EonetGeometry[] | undefined): EonetGeometry[] {
  return [...(geometry ?? [])].sort((a, b) =>
    (a.date ?? '').localeCompare(b.date ?? ''),
  )
}

function placeFromTitle(title: string): string {
  const comma = title.indexOf(',')
  return comma === -1 ? '' : title.slice(comma + 1).trim()
}

function formatGeometryLocation(
  geometry: EonetGeometry | undefined,
): string | null {
  const point = latLngFromGeometry(geometry)
  return point ? formatLatLng(point.lat, point.lng) : null
}

function polygonFromGeometry(
  geometry: EonetGeometry,
): [number, number][] | null {
  if (geometry.type !== 'Polygon') {
    return null
  }

  const ring = geometry.coordinates[0]
  if (!Array.isArray(ring)) {
    return null
  }

  const latLngs = latLngsFromPolygonRing(ring)
  if (latLngs.length === 0) {
    return null
  }

  return latLngs.map((point) => [point.lat, point.lng])
}

function maxMagnitude(
  observations: EventObservation[],
): { value: number; unit: string } | null {
  let max: { value: number; unit: string } | null = null

  for (const observation of observations) {
    if (observation.magnitudeValue == null) {
      continue
    }
    if (max == null || observation.magnitudeValue > max.value) {
      max = {
        value: observation.magnitudeValue,
        unit: observation.magnitudeUnit ?? '',
      }
    }
  }

  return max
}
