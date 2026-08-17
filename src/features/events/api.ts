import { apiGet } from '../../shared/api/client'
import type { EonetEvent } from '../../shared/types/event'

interface EonetEventsResponse {
  title: string
  events: EonetEvent[]
  description: string
  link: string
}

export function getEvents(signal?: AbortSignal): Promise<EonetEventsResponse> {
  return apiGet<EonetEventsResponse>('/events?status=open&days=7', { signal })
}
