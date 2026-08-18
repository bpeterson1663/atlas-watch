import { useEffect, useState } from 'react'
import type { EonetEvent } from '../types/event'
import type { Status } from '../types/status'
import { getEvents } from '../api/eonet'
import { isAbortError } from '../api/error'

interface EventsState {
  message: string
  events: EonetEvent[]
  status: Status
}

export function useEvents(): EventsState {
  const [state, setState] = useState<EventsState>({
    message: '',
    events: [],
    status: 'loading',
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadEvents() {
      try {
        const { events } = await getEvents(controller.signal)

        setState({ message: '', events, status: 'success' })
      } catch (err) {
        if (isAbortError(err)) {
          return
        }

        const message =
          err instanceof Error ? err.message : 'Failed to load events'
        setState({ status: 'error', message, events: [] })
      }
    }

    void loadEvents()

    return () => {
      controller.abort()
    }
  }, [])

  return state
}
