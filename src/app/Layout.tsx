import { AppShell, Box, Center, Loader } from '@mantine/core'
import { Suspense } from 'react'
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
          <Suspense
            fallback={
              <Center h={240}>
                <Loader color="navy" />
              </Center>
            }
          >
            <Outlet />
          </Suspense>
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
