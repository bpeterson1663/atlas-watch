import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/dom'
import { MemoryRouter } from 'react-router-dom'
import { renderWithMantine } from '../test/render'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  it('renders status/time filters and loading layout', () => {
    const { container } = renderWithMantine(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('radiogroup', { name: 'Status' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('radiogroup', { name: 'Time range' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByPlaceholderText(/search events or locations/i),
    ).not.toBeInTheDocument()
    expect(
      container.querySelectorAll('.mantine-Skeleton-root').length,
    ).toBeGreaterThan(0)
  })
})
