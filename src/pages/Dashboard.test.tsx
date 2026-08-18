import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/dom'
import { MemoryRouter } from 'react-router-dom'
import { renderWithMantine } from '../test/render'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  it('renders the filter bar and loading layout', () => {
    const { container } = renderWithMantine(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    expect(
      screen.getByPlaceholderText(/search events or locations/i),
    ).toBeInTheDocument()
    expect(
      container.querySelectorAll('.mantine-Skeleton-root').length,
    ).toBeGreaterThan(0)
  })
})
