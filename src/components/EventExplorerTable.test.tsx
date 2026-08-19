import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { renderWithMantine } from '../test/render'
import type { EventView } from '../types/event'
import { EventExplorerTable } from './EventExplorerTable'

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

function eventTitles() {
  const rows = screen.getAllByRole('row').slice(1)
  return rows.map(
    (row) => within(row).getAllByRole('cell')[0].textContent ?? '',
  )
}

describe('EventExplorerTable', () => {
  it('sorts by the clicked column and reverses on a second click', async () => {
    const user = userEvent.setup()

    renderWithMantine(
      <MemoryRouter>
        <EventExplorerTable
          selectedId={null}
          onSelect={vi.fn()}
          events={[
            view({
              id: 'newer',
              title: 'Zebra Fire',
              lastDate: '2026-08-16T00:00:00Z',
            }),
            view({
              id: 'older',
              title: 'Alpha Storm',
              lastDate: '2026-08-10T00:00:00Z',
            }),
          ]}
        />
      </MemoryRouter>,
    )

    expect(eventTitles()[0]).toContain('Zebra Fire')

    await user.click(screen.getByRole('button', { name: 'Event Name' }))
    expect(eventTitles()[0]).toContain('Alpha Storm')

    await user.click(screen.getByRole('button', { name: 'Event Name' }))
    expect(eventTitles()[0]).toContain('Zebra Fire')
  })
})
