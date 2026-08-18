import type { EonetGeometry } from '../types/event'

export type LatLng = { lat: number; lng: number }

export function latLngFromGeometry(
  geometry: EonetGeometry | undefined,
): LatLng | null {
  if (!geometry) {
    return null
  }

  if (geometry.type === 'Point' && isPair(geometry.coordinates)) {
    return toLatLng(geometry.coordinates)
  }

  if (geometry.type === 'Polygon') {
    const ring = geometry.coordinates[0]
    if (!Array.isArray(ring)) {
      return null
    }
    return centerOfRing(ring)
  }

  return null
}

export function latLngsFromPolygonRing(ring: unknown[]): LatLng[] {
  const points = ring.filter(isPair)
  if (points.length === 0) {
    return []
  }

  const order = ringReadingOrder(points)
  const latLngs: LatLng[] = []

  for (const [a, b] of points) {
    const point = order === 'gdacs' ? valid(a, b) : valid(b, a)
    if (point) {
      latLngs.push(point)
    }
  }

  return latLngs
}

function centerOfRing(ring: unknown[]): LatLng | null {
  const latLngs = latLngsFromPolygonRing(ring)
  if (latLngs.length === 0) {
    return null
  }

  const lat =
    latLngs.reduce((sum, point) => sum + point.lat, 0) / latLngs.length
  const lng =
    latLngs.reduce((sum, point) => sum + point.lng, 0) / latLngs.length

  return valid(lat, lng)
}

function ringReadingOrder(points: [number, number][]): 'geoJson' | 'gdacs' {
  const geoJson = average(points, (a, b) => valid(b, a))
  const gdacs = average(points, (a, b) => valid(a, b))

  if (geoJson && gdacs) {
    const picked = preferReading(geoJson, gdacs)
    if (picked === geoJson) {
      return 'geoJson'
    }
    if (picked === gdacs) {
      return 'gdacs'
    }
    return 'gdacs'
  }

  return gdacs ? 'gdacs' : 'geoJson'
}

function toLatLng([a, b]: [number, number]): LatLng | null {
  if (Math.abs(a) > 90) {
    return valid(b, a)
  }
  if (Math.abs(b) > 90) {
    return valid(a, b)
  }

  return valid(b, a)
}

function preferReading(geoJson: LatLng, gdacs: LatLng): LatLng | null {
  const geoJsonInPolar = Math.abs(geoJson.lat) > 66
  const gdacsInPolar = Math.abs(gdacs.lat) > 66

  if (geoJsonInPolar && !gdacsInPolar) {
    return gdacs
  }
  if (gdacsInPolar && !geoJsonInPolar) {
    return geoJson
  }

  return null
}

function average(
  points: [number, number][],
  toLatLng: (a: number, b: number) => LatLng | null,
): LatLng | null {
  let latSum = 0
  let lngSum = 0
  let count = 0

  for (const [a, b] of points) {
    const point = toLatLng(a, b)
    if (!point) {
      continue
    }
    latSum += point.lat
    lngSum += point.lng
    count++
  }

  if (count === 0) {
    return null
  }

  return valid(latSum / count, lngSum / count)
}

function valid(lat: number, lng: number): LatLng | null {
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null
  }
  return { lat, lng }
}

function isPair(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  )
}
