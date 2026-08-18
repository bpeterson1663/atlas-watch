import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/dom'
import { MemoryRouter } from 'react-router-dom'
import { renderWithMantine } from '../test/render'
import { Header } from './Header'

describe('Header', () => {
  it('identifies Atlas Watch and shows navigation links', () => {
    renderWithMantine(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByText('Atlas Watch')).toBeInTheDocument()
    expect(
      screen.getByText('Explore active natural events around the world'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(
      screen.getByRole('link', { name: 'Event Explorer' }),
    ).toHaveAttribute('href', '/explorer')
  })
})
