import type { EventObservation } from '../types/event'

// Oldest → newest, matching the map legend.
const TRACK_COLORS = ['#fa5252', '#fd7e14', '#fab005', '#40c057']

export type LocatedObservation = EventObservation & {
  lat: number
  lng: number
}

export function locatedObservations(
  observations: EventObservation[],
): LocatedObservation[] {
  return observations.filter(
    (observation): observation is LocatedObservation =>
      Number.isFinite(observation.lat) && Number.isFinite(observation.lng),
  )
}

export function observationColor(index: number, count: number): string {
  const latest = TRACK_COLORS[TRACK_COLORS.length - 1]
  if (count <= 1) {
    return latest
  }

  const progress = index / (count - 1)
  const colorIndex = Math.round(progress * (TRACK_COLORS.length - 1))
  return TRACK_COLORS[colorIndex]
}

export function formatLatLng(lat: number, lng: number): string {
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}°${ns}, ${Math.abs(lng).toFixed(2)}°${ew}`
}
