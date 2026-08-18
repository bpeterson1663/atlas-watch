import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { MantineProvider } from '@mantine/core'
import { theme } from '../styles/theme'

import '@mantine/core/styles.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

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
