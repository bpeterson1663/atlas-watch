import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { renderWithMantine } from '../test/render'
import { EventDetail } from './EventDetail'

describe('EventDetail', () => {
  it('shows a back link and loading state', () => {
    const { container } = renderWithMantine(
      <MemoryRouter initialEntries={['/events/EONET_1']}>
        <Routes>
          <Route path="/events/:eventId" element={<EventDetail />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Back')).toBeInTheDocument()
    expect(
      container.querySelectorAll('.mantine-Skeleton-root').length,
    ).toBeGreaterThan(0)
  })
})
