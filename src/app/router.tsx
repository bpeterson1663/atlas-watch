import { createBrowserRouter } from 'react-router-dom'

import { Layout } from './Layout.tsx'
import { Dashboard } from '../pages/Dashboard.tsx'
import { EventDetail } from '../pages/EventDetail.tsx'

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
        path: 'events/:eventId',
        element: <EventDetail />,
      },
    ],
  },
])
