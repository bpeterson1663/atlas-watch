import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/dom'
import { renderWithMantine } from '../test/render'
import { Header } from './Header'

describe('Header', () => {
  it('identifies Atlas Watch', () => {
    renderWithMantine(<Header />)

    expect(screen.getByText('Atlas Watch')).toBeInTheDocument()
    expect(
      screen.getByText('Explore active natural events around the world'),
    ).toBeInTheDocument()
  })
})
