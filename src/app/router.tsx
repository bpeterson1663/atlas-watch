import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { Layout } from './Layout.tsx'

const Dashboard = lazy(() =>
  import('../pages/Dashboard.tsx').then((module) => ({
    default: module.Dashboard,
  })),
)
const EventExplorer = lazy(() =>
  import('../pages/EventExplorer.tsx').then((module) => ({
    default: module.EventExplorer,
  })),
)
const EventDetail = lazy(() =>
  import('../pages/EventDetail.tsx').then((module) => ({
    default: module.EventDetail,
  })),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'explorer',
        element: <EventExplorer />,
      },
      {
        path: 'events/:eventId',
        element: <EventDetail />,
      },
    ],
  },
])
