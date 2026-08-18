import { Paper, Stack, Text } from '@mantine/core'
import { useEffect } from 'react'
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import type { EventObservation } from '../types/event'
import { formatUtc } from '../lib/date'
import {
  formatLatLng,
  locatedObservations,
  observationColor,
} from '../lib/observation'

interface Props {
  observations: EventObservation[]
}

export function EventTrackMap({ observations }: Props) {
  const points = locatedObservations(observations)
  const latLngs = points.map(
    (point) => [point.lat, point.lng] as [number, number],
  )

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={latLngs[0] ?? [20, 0]}
        zoom={latLngs.length === 1 ? 4 : 2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds points={latLngs} />
        {latLngs.length > 1 && (
          <Polyline
            positions={latLngs}
            pathOptions={{ color: '#1b365d', weight: 2, opacity: 0.7 }}
          />
        )}
        {points.map((point, index) => {
          const color = observationColor(index, points.length)
          const isLatest = index === points.length - 1
          return (
            <CircleMarker
              key={`${point.date}-${index}`}
              center={[point.lat, point.lng]}
              radius={isLatest ? 9 : 6}
              pathOptions={{
                color: isLatest ? '#1b365d' : color,
                fillColor: color,
                fillOpacity: 0.95,
                weight: isLatest ? 3 : 1,
              }}
            >
              <Tooltip>
                {formatUtc(point.date)} · {formatLatLng(point.lat, point.lng)}
                {point.magnitudeValue != null
                  ? ` · ${point.magnitudeValue} ${point.magnitudeUnit ?? ''}`
                  : ''}
              </Tooltip>
            </CircleMarker>
          )
        })}
      </MapContainer>
      {points.length > 1 && (
        <ObservationLegend
          firstDate={points[0].date}
          lastDate={points[points.length - 1].date}
        />
      )}
    </div>
  )
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  const pointsKey = points.map((point) => point.join(',')).join('|')

  useEffect(() => {
    const size = map.getSize()
    if (size.x === 0 || size.y === 0 || points.length === 0) {
      return
    }

    if (points.length === 1) {
      map.setView(points[0], 4)
      return
    }

    map.fitBounds(points, { padding: [28, 28], maxZoom: 8 })
  }, [map, pointsKey])

  return null
}

function ObservationLegend({
  firstDate,
  lastDate,
}: {
  firstDate: string
  lastDate: string
}) {
  return (
    <Paper
      shadow="sm"
      p="xs"
      radius="md"
      style={{
        position: 'absolute',
        left: 12,
        bottom: 12,
        zIndex: 1000,
      }}
    >
      <Text size="xs" fw={700} mb={6}>
        Observation history
      </Text>
      <Stack gap={4}>
        <LegendRow color="#40c057" label={`Latest (${formatUtc(lastDate)})`} />
        <LegendRow color="#fab005" label="Mid track" />
        <LegendRow color="#fd7e14" label="Earlier" />
        <LegendRow
          color="#fa5252"
          label={`Earliest (${formatUtc(firstDate)})`}
        />
      </Stack>
    </Paper>
  )
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <Text
      size="xs"
      component="div"
      style={{ display: 'flex', gap: 8, alignItems: 'center' }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
          flexShrink: 0,
        }}
      />
      {label}
    </Text>
  )
}
