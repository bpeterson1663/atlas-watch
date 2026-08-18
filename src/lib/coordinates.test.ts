import { describe, expect, it } from 'vitest'
import type { EonetGeometry } from '../types/event'
import { latLngFromGeometry, latLngsFromPolygonRing } from './coordinates'

function polygon(coords: [number, number][]): EonetGeometry {
  return {
    date: '2026-08-10T20:00:00Z',
    type: 'Polygon',
    coordinates: [coords],
    magnitudeValue: null,
    magnitudeUnit: null,
  }
}

function geoPoint(lat: number, lng: number): EonetGeometry {
  return {
    date: '2026-08-15T18:00:00Z',
    type: 'Point',
    coordinates: [lng, lat],
    magnitudeValue: null,
    magnitudeUnit: null,
  }
}

describe('latLngFromGeometry', () => {
  it('reads GeoJSON points as [lng, lat]', () => {
    expect(latLngFromGeometry(geoPoint(17.9, -155))).toEqual({
      lat: 17.9,
      lng: -155,
    })
  })

  it('reads GeoJSON points when both values are within ±90', () => {
    // Zambia region: [lng, lat] = [25.10, -17.58]
    expect(latLngFromGeometry(geoPoint(-17.58, 25.1))).toEqual({
      lat: -17.58,
      lng: 25.1,
    })

    // Angola region: [lng, lat] = [-10.15, -16.47]
    expect(latLngFromGeometry(geoPoint(-16.47, -10.15))).toEqual({
      lat: -16.47,
      lng: -10.15,
    })
  })

  it('reads standard GeoJSON polygons', () => {
    const point = latLngFromGeometry(
      polygon([
        [-71.4, -36.9],
        [-71.3, -36.9],
        [-71.4, -36.9],
      ]),
    )

    expect(point?.lat).toBeCloseTo(-36.9, 1)
    expect(point?.lng).toBeCloseTo(-71.37, 1)
  })

  it('reads GDACS flood polygons stored as [lat, lng]', () => {
    const mexico = latLngFromGeometry(
      polygon([
        [24.752851, -107.393395],
        [24.752906, -107.391185],
        [24.752851, -107.393395],
      ]),
    )
    expect(mexico?.lat).toBeCloseTo(24.75, 1)
    expect(mexico?.lng).toBeCloseTo(-107.39, 1)

    const venezuela = latLngFromGeometry(
      polygon([
        [6.1501107, -74.07905],
        [6.1494449, -74.078801],
        [6.1501107, -74.07905],
      ]),
    )
    expect(venezuela?.lat).toBeCloseTo(6.15, 1)
    expect(venezuela?.lng).toBeCloseTo(-74.08, 1)

    const andorra = latLngFromGeometry(
      polygon([
        [42.499665, 1.733494],
        [42.4997, 1.7336],
        [42.499665, 1.733494],
      ]),
    )
    expect(andorra?.lat).toBeCloseTo(42.5, 1)
    expect(andorra?.lng).toBeCloseTo(1.73, 1)
  })

  it('uses the center of large flood polygons', () => {
    const chad = latLngFromGeometry(
      polygon([
        [13.421411, 22.197719],
        [13.421466, 22.199929],
        [13.511501, 22.242764],
        [13.421411, 22.197719],
      ]),
    )

    expect(chad?.lat).toBeCloseTo(13.44, 1)
    expect(chad?.lng).toBeCloseTo(22.21, 1)
  })

  it('returns every corner of a polygon ring as lat/lng pairs', () => {
    const ring = latLngsFromPolygonRing([
      [13.421411, 22.197719],
      [13.511501, 22.242764],
      [13.421411, 22.197719],
    ])

    expect(ring).toHaveLength(3)
    expect(ring[0]?.lat).toBeCloseTo(13.42, 1)
    expect(ring[0]?.lng).toBeCloseTo(22.2, 1)
  })
})
