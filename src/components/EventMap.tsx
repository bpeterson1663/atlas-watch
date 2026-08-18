import { CircleMarker, MapContainer, Tooltip, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import type { EventView } from '../types/event'
import { categoryStyle } from '../lib/category'
import { useEffect } from 'react'
import { Badge } from '@mantine/core'
import { ResizeMap } from './ResizeMap'
import { BasemapTiles } from './BasemapTiles'
import mapClasses from '../styles/map.module.css'

type EventMapProps = {
  events: EventView[]
  interactive?: boolean
  selectedId?: string | null
  onSelect?: (id: string) => void
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
    const nextZoom = Number.isFinite(zoom) ? Math.max(zoom, 7) : 7
    leafletMap.flyTo(point, nextZoom, {
      duration: 0.6,
    })
  }, [event, leafletMap])
  return null
}

export function EventMap({
  events,
  interactive = true,
  selectedId = null,
  onSelect,
}: EventMapProps) {
  const selected = interactive
    ? events.find((event) => event.id === selectedId)
    : undefined

  return (
    <div className={mapClasses.shell}>
      {!interactive && (
        <Badge
          className={mapClasses.overviewLabel}
          variant="light"
          color="gray"
          size="sm"
        >
          Map overview
        </Badge>
      )}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className={mapClasses.container}
        scrollWheelZoom
      >
        <BasemapTiles />
        <ResizeMap />
        {interactive && <FlyToSelected event={selected} />}
        <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
          {events.map((event) => {
            const point = coordinatesOf(event)
            if (!point) {
              return null
            }
            const selectedMark = interactive && event.id === selectedId
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
                eventHandlers={
                  interactive && onSelect
                    ? { click: () => onSelect(event.id) }
                    : undefined
                }
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
