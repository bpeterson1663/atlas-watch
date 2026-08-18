import { describe, expect, it } from 'vitest'
import {
  formatLatLng,
  locatedObservations,
  observationColor,
} from './observation'
import type { EventObservation } from '../types/event'

function observation(
  overrides: Partial<EventObservation> = {},
): EventObservation {
  return {
    date: '2026-08-15T00:00:00Z',
    lat: 20,
    lng: -80,
    magnitudeValue: null,
    magnitudeUnit: null,
    ...overrides,
  }
}

describe('observationColor', () => {
  it('uses the latest (green) color for a single point', () => {
    expect(observationColor(0, 1)).toBe('#40c057')
  })

  it('uses red for the earliest observation in a series', () => {
    expect(observationColor(0, 8).toLowerCase()).toBe('#fa5252')
  })

  it('uses green for the latest observation in a series', () => {
    expect(observationColor(7, 8).toLowerCase()).toBe('#40c057')
  })
})

describe('locatedObservations', () => {
  it('drops observations without finite coordinates', () => {
    const points = locatedObservations([
      observation({ lat: 10, lng: 20 }),
      observation({ lat: null, lng: -80 }),
      observation({ lat: Number.NaN, lng: 1 }),
    ])

    expect(points).toHaveLength(1)
    expect(points[0]).toMatchObject({ lat: 10, lng: 20 })
  })
})

describe('formatLatLng', () => {
  it('formats northern and western hemispheres', () => {
    expect(formatLatLng(29.2, -56.1)).toBe('29.20°N, 56.10°W')
  })
})
