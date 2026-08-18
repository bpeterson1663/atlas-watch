import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import type { EventView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { useEffect } from 'react'
import { ResizeMap } from './ResizeMap'
import mapClasses from '../styles/map.module.css'

type EventMapProps = {
  events: EventView[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function coordinatesOf(event: EventView): [number, number] | null {
  if (Number.isFinite(event.lastLat) && Number.isFinite(event.lastLng)) {
    return [event.lastLat as number, event.lastLng as number]
  }
  return null
}

function FlyToSelected({ event }: { event: EventView | undefined }) {
  const leafletMap = useMap()
  useEffect(() => {
    const point = event ? coordinatesOf(event) : null
    if (!point) {
      return
    }

    const size = leafletMap.getSize()
    if (size.x === 0 || size.y === 0) {
      return
    }

    const zoom = leafletMap.getZoom()
    leafletMap.flyTo(point, Number.isFinite(zoom) ? Math.max(zoom, 4) : 4, {
      duration: 0.6,
    })
  }, [event, leafletMap])
  return null
}

export function EventMap({ events, selectedId, onSelect }: EventMapProps) {
  const selected = events.find((event) => event.id === selectedId)

  return (
    <div className={mapClasses.shell}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className={mapClasses.container}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ResizeMap />
        <FlyToSelected event={selected} />
        <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
          {events.map((event) => {
            const point = coordinatesOf(event)
            if (!point) {
              return null
            }
            const selectedMark = event.id === selectedId
            const { hex } = categoryStyle(event.categoryId)
            return (
              <CircleMarker
                key={event.id}
                center={point}
                radius={selectedMark ? 10 : 6}
                pathOptions={{
                  color: selectedMark ? 'var(--mantine-color-navy-6)' : hex,
                  fillColor: hex,
                  fillOpacity: 0.9,
                  weight: selectedMark ? 3 : 1,
                }}
                eventHandlers={{ click: () => onSelect(event.id) }}
              >
                {selectedMark && (
                  <Tooltip>
                    {event.title} · {event.categoryTitle}
                  </Tooltip>
                )}
              </CircleMarker>
            )
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
