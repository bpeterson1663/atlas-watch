import { describe, expect, it } from 'vitest'
import type { EonetEvent, EventView } from '../types/event'
import {
  buildDashboardSummary,
  summaryEventSubtext,
} from './summary'

function view(overrides: Partial<EventView> = {}): EventView {
  return {
    id: 'EONET_1',
    title: 'Wildfire',
    description: null,
    categoryId: 'wildfires',
    categoryTitle: 'Wildfires',
    isOpen: true,
    firstDate: '2026-08-10T00:00:00Z',
    lastDate: '2026-08-16T00:00:00Z',
    locationLabel: 'California',
    lastLat: 1,
    lastLng: 1,
    geometryCount: 1,
    sourceCount: 1,
    ...overrides,
  }
}

function rawEvent(overrides: Partial<EonetEvent> = {}): EonetEvent {
  return {
    id: 'EONET_1',
    title: 'Wildfire',
    description: null,
    closed: null,
    categories: [{ id: 'wildfires', title: 'Wildfires' }],
    sources: [{ id: 'MODIS', url: 'https://example.com' }],
    geometry: [],
    ...overrides,
  }
}

describe('buildDashboardSummary', () => {
  it('counts events, status split, top category, and unique sources', () => {
    const views = [
      view({ id: 'a', categoryId: 'wildfires', categoryTitle: 'Wildfires' }),
      view({
        id: 'b',
        categoryId: 'wildfires',
        categoryTitle: 'Wildfires',
        isOpen: false,
      }),
      view({
        id: 'c',
        categoryId: 'floods',
        categoryTitle: 'Floods',
        isOpen: false,
      }),
    ]

    const events = [
      rawEvent({ id: 'a', sources: [{ id: 'MODIS', url: 'https://a.com' }] }),
      rawEvent({
        id: 'b',
        sources: [{ id: 'VIIRS', url: 'https://b.com' }],
      }),
      rawEvent({
        id: 'c',
        sources: [{ id: 'MODIS', url: 'https://c.com' }],
      }),
    ]

    expect(buildDashboardSummary(views, events)).toEqual({
      eventCount: 3,
      openCount: 1,
      closedCount: 2,
      topCategory: {
        id: 'wildfires',
        title: 'Wildfires',
        count: 2,
        share: 67,
      },
      sourceCount: 2,
    })
  })
})

describe('summaryEventSubtext', () => {
  it('shows open and closed counts when status is all', () => {
    expect(
      summaryEventSubtext(
        {
          eventCount: 3,
          openCount: 1,
          closedCount: 2,
          topCategory: null,
          sourceCount: 0,
        },
        { days: 7, status: 'all' },
      ),
    ).toBe('1 open · 2 closed')
  })
})
