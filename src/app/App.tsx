import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { MantineProvider } from '@mantine/core'
import { theme } from '../styles/theme'

import '@mantine/core/styles.css'

function App() {
  return (
    <>
      <MantineProvider theme={theme} forceColorScheme="light">
        <RouterProvider router={router} />
      </MantineProvider>
    </>
  )
}

export default App
