import { AppShell, Box } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import layout from '../styles/layout.module.css'

export function Layout() {
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Box className={layout.container}>
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
