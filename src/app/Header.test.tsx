import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/dom'
import { renderWithMantine } from '../test/render'
import { Header } from './Header'

describe('Header', () => {
  it('identifies Atlas Watch and exposes search', () => {
    renderWithMantine(<Header />)

    expect(screen.getByText('Atlas Watch')).toBeInTheDocument()
    expect(
      screen.getByText('Explore active natural events around the world'),
    ).toBeInTheDocument()
    expect(screen.getByText(/last updated/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/search events, locations/i),
    ).toBeInTheDocument()
  })
})
