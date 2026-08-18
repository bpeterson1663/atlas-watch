import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from 'react-leaflet'
import type { EventView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { useEffect } from 'react'

type EventMapProps = {
  events: EventView[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function FlyToSelected({ event }: { event: EventView | undefined }) {
  const map = useMap()
  useEffect(() => {
    if (event?.lastLat == null || event.lastLng == null) return
    map.flyTo([event.lastLat, event.lastLng], Math.max(map.getZoom(), 4), {
      duration: 0.6,
    })
  }, [event, map])
  return null
}

export function EventMap({ events, selectedId, onSelect }: EventMapProps) {
  const selected = events.find((e) => e.id === selectedId)

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FlyToSelected event={selected} />
      {events.map((event) => {
        if (event.lastLat == null || event.lastLng == null) return null
        const selectedMark = event.id === selectedId
        return (
          <CircleMarker
            key={event.id}
            center={[event.lastLat, event.lastLng]}
            radius={selectedMark ? 10 : 6}
            pathOptions={{
              color: selectedMark
                ? '#1b365d'
                : categoryStyle(event.categoryId).hex,
              fillColor: categoryStyle(event.categoryId).hex,
              fillOpacity: 0.9,
              weight: selectedMark ? 3 : 1,
            }}
            eventHandlers={{ click: () => onSelect(event.id) }}
          >
            <Tooltip>
              {event.title} · {event.categoryTitle}
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
