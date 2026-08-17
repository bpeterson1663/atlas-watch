import { describe, it, expect } from 'vitest'
import { renderWithMantine } from '../test/render'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  it('renders the empty map and list layout', () => {
    const { container } = renderWithMantine(<Dashboard />)

    expect(
      container.querySelectorAll('.mantine-Skeleton-root').length,
    ).toBeGreaterThan(0)
  })
})
