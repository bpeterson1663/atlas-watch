import { useEffect, useState } from 'react'
import type { EonetEvent } from '../types/event'
import type { Status } from '../types/status'
import { getEvent } from '../api/eonet'
import { ApiError, isAbortError } from '../api/error'

interface EventState {
  event: EonetEvent | null
  status: Status
  message: string
  notFound: boolean
}

export function useEvent(id: string | undefined): EventState {
  const [state, setState] = useState<EventState>({
    event: null,
    status: 'loading',
    message: '',
    notFound: false,
  })

  useEffect(() => {
    if (!id) {
      setState({
        event: null,
        status: 'error',
        message: 'Event not found',
        notFound: true,
      })
      return
    }

    const eventId = id
    const controller = new AbortController()
    setState({ event: null, status: 'loading', message: '', notFound: false })

    async function loadEvent() {
      try {
        const event = await getEvent(eventId, controller.signal)
        setState({ event, status: 'success', message: '', notFound: false })
      } catch (err) {
        if (isAbortError(err)) {
          return
        }

        const notFound = err instanceof ApiError && err.status === 404
        const message = notFound
          ? 'Event not found'
          : err instanceof Error
            ? err.message
            : 'Failed to load event'
        setState({ event: null, status: 'error', message, notFound })
      }
    }

    void loadEvent()

    return () => {
      controller.abort()
    }
  }, [id])

  return state
}
