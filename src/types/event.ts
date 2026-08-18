export interface EonetGeometry {
  date: string
  type: 'Point' | 'Polygon'
  coordinates: number[] | number[][][]
  magnitudeValue: number | null
  magnitudeUnit: string | null
}

export interface EonetEvent {
  id: string
  title: string
  description: string | null
  closed: string | null
  categories: { id: string; title: string }[]
  sources: { id: string; url: string }[]
  geometry: EonetGeometry[]
}

export type MagnitudeKind = 'wind' | 'area' | 'none'

export interface EventView {
  id: string
  title: string
  categoryId: string
  categoryTitle: string
  isOpen: boolean
  lastDate: string
  locationLabel: string
  lastLat: number | null
  lastLng: number | null
}

export interface EventObservation {
  date: string
  lat: number | null
  lng: number | null
  magnitudeValue: number | null
  magnitudeUnit: string | null
}

export interface EventDetailView {
  id: string
  title: string
  description: string | null
  categoryId: string
  categoryTitle: string
  isOpen: boolean
  firstDate: string
  lastDate: string
  observations: EventObservation[]
  sources: { id: string; url: string }[]
  maxMagnitude: { value: number; unit: string } | null
}
