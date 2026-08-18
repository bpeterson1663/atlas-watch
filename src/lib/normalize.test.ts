import { describe, expect, it } from 'vitest'
import type { EonetEvent, EonetGeometry } from '../types/event'
import { normalizeEvent, normalizeEvents } from './normalize'

function event(overrides: Partial<EonetEvent> = {}): EonetEvent {
  return {
    id: 'EONET_1',
    title: 'Tropical Storm Lala',
    description: null,
    closed: null,
    categories: [{ id: 'severeStorms', title: 'Severe Storms' }],
    sources: [{ id: 'JTWC', url: 'https://example.com' }],
    geometry: [point(17.9, -155, '2026-08-15T18:00:00Z')],
    ...overrides,
  }
}

function point(lat: number, lng: number, date: string): EonetGeometry {
  return {
    date,
    type: 'Point',
    coordinates: [lng, lat],
    magnitudeValue: null,
    magnitudeUnit: null,
  }
}

describe('normalizeEvent', () => {
  it('uses the place name from the title when present', () => {
    const view = normalizeEvent(
      event({
        title: 'Wildfire PLAINS, San Luis Obispo, California',
        categories: [{ id: 'wildfires', title: 'Wildfires' }],
      }),
    )

    expect(view.locationLabel).toBe('San Luis Obispo, California')
    expect(view.categoryId).toBe('wildfires')
    expect(view.categoryTitle).toBe('Wildfires')
  })

  it('falls back to hemisphere coordinates when the title has no place', () => {
    const view = normalizeEvent(event())

    expect(view.locationLabel).toBe('17.90°N, 155.00°W')
  })

  it('formats southern and eastern hemispheres', () => {
    const view = normalizeEvent(
      event({
        geometry: [point(-36.87, 174.76, '2026-06-15T00:00:00Z')],
      }),
    )

    expect(view.locationLabel).toBe('36.87°S, 174.76°E')
  })

  it('uses the first coordinate of a polygon when there is no place in the title', () => {
    const view = normalizeEvent(
      event({
        geometry: [
          {
            date: '2026-08-01T00:00:00Z',
            type: 'Polygon',
            coordinates: [
              [
                [-71.4, -36.9],
                [-71.3, -36.9],
                [-71.4, -36.9],
              ],
            ],
            magnitudeValue: null,
            magnitudeUnit: null,
          },
        ],
      }),
    )

    expect(view.locationLabel).toBe('36.90°S, 71.40°W')
  })

  it('treats a missing closed date as open', () => {
    expect(normalizeEvent(event({ closed: null })).isOpen).toBe(true)
  })

  it('treats a closed date as not open', () => {
    expect(
      normalizeEvent(event({ closed: '2026-08-16T00:00:00Z' })).isOpen,
    ).toBe(false)
  })

  it('uses the last geometry date and unknown category when those fields are missing', () => {
    const view = normalizeEvent(
      event({
        categories: [],
        geometry: [
          point(18, -155, '2026-08-14T00:00:00Z'),
          point(19, -156, '2026-08-16T06:00:00Z'),
        ],
      }),
    )

    expect(view.lastDate).toBe('2026-08-16T06:00:00Z')
    expect(view.categoryId).toBe('unknown')
    expect(view.categoryTitle).toBe('Unknown')
  })

  it('falls back when there is no geometry', () => {
    const view = normalizeEvent(event({ geometry: [] }))

    expect(view.lastDate).toBe('')
    expect(view.locationLabel).toBe('Location unavailable')
  })
})

describe('normalizeEvents', () => {
  it('sorts events by most recently observed first', () => {
    const views = normalizeEvents([
      event({
        id: 'older',
        geometry: [point(1, 1, '2026-08-10T00:00:00Z')],
      }),
      event({
        id: 'newer',
        geometry: [point(1, 1, '2026-08-16T00:00:00Z')],
      }),
    ])

    expect(views.map((view) => view.id)).toEqual(['newer', 'older'])
  })
})
