import { Paper, Stack, Text } from '@mantine/core'
import { useEffect } from 'react'
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Polyline,
  Tooltip,
  useMap,
} from 'react-leaflet'
import { ResizeMap } from './ResizeMap'
import { BasemapTiles } from './BasemapTiles'
import type { EventObservation } from '../types/event'
import { categoryStyle } from '../lib/category'
import { formatUtc } from '../lib/date'
import {
  formatLatLng,
  locatedObservations,
  observationColor,
} from '../lib/observation'
import mapClasses from '../styles/map.module.css'

interface Props {
  observations: EventObservation[]
  categoryId: string
}

export function EventTrackMap({ observations, categoryId }: Props) {
  const { hex } = categoryStyle(categoryId)
  const trackPoints = locatedObservations(observations)
  const trackLatLngs = trackPoints.map(
    (point) => [point.lat, point.lng] as [number, number],
  )
  const polygonLatLngs = observations.flatMap(
    (observation) => observation.polygon ?? [],
  )
  const boundsPoints = [...trackLatLngs, ...polygonLatLngs]

  return (
    <div className={mapClasses.shell}>
      <MapContainer
        center={boundsPoints[0] ?? [20, 0]}
        zoom={boundsPoints.length === 1 ? 10 : 4}
        className={mapClasses.container}
        scrollWheelZoom
      >
        <BasemapTiles />
        <ResizeMap />
        <FitBounds points={boundsPoints} />
        {observations.map((observation, index) => {
          if (!observation.polygon?.length) {
            return null
          }

          return (
            <Polygon
              key={`${observation.date}-${index}-polygon`}
              positions={observation.polygon}
              pathOptions={{
                color: hex,
                fillColor: hex,
                fillOpacity: 0.25,
                weight: 2,
              }}
            />
          )
        })}
        {trackLatLngs.length > 1 && (
          <Polyline
            positions={trackLatLngs}
            pathOptions={{
              color: 'var(--mantine-color-navy-6)',
              weight: 2,
              opacity: 0.7,
            }}
          />
        )}
        {trackPoints.map((point, index) => {
          if (point.polygon?.length) {
            return null
          }

          const color = observationColor(index, trackPoints.length)
          const isLatest = index === trackPoints.length - 1
          return (
            <CircleMarker
              key={`${point.date}-${index}`}
              center={[point.lat, point.lng]}
              radius={isLatest ? 9 : 6}
              pathOptions={{
                color: isLatest ? 'var(--mantine-color-navy-6)' : color,
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
      {trackPoints.length > 1 && (
        <ObservationLegend
          firstDate={trackPoints[0].date}
          lastDate={trackPoints[trackPoints.length - 1].date}
        />
      )}
    </div>
  )
}

function FitBounds({ points }: { points: [number, number][] }) {
  const leafletMap = useMap()
  const pointsKey = points.map((point) => point.join(',')).join('|')

  useEffect(() => {
    function fit() {
      const size = leafletMap.getSize()
      if (size.x === 0 || size.y === 0 || points.length === 0) {
        return false
      }

      if (points.length === 1) {
        leafletMap.setView(points[0], 8)
        return true
      }

      leafletMap.fitBounds(points, { padding: [28, 28], maxZoom: 12 })
      return true
    }

    leafletMap.invalidateSize()

    if (fit()) {
      return
    }

    const retry = window.setTimeout(() => {
      leafletMap.invalidateSize()
      fit()
    }, 100)

    return () => {
      window.clearTimeout(retry)
    }
  }, [leafletMap, pointsKey])

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
    <Paper shadow="sm" p="xs" radius="md" className={mapClasses.legend}>
      <Text size="xs" fw={700} mb={6}>
        Observation history
      </Text>
      <Stack gap={4}>
        <LegendRow
          dotClass={mapClasses.legendDotLatest}
          label={`Latest (${formatUtc(lastDate)})`}
        />
        <LegendRow dotClass={mapClasses.legendDotMid} label="Mid track" />
        <LegendRow dotClass={mapClasses.legendDotEarlier} label="Earlier" />
        <LegendRow
          dotClass={mapClasses.legendDotEarliest}
          label={`Earliest (${formatUtc(firstDate)})`}
        />
      </Stack>
    </Paper>
  )
}

function LegendRow({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <Text size="xs" component="div" className={mapClasses.legendRow}>
      <span className={`${mapClasses.legendDot} ${dotClass}`} />
      {label}
    </Text>
  )
}
