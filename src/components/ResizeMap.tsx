import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export function ResizeMap() {
  const map = useMap()

  useEffect(() => {
    function handleResize() {
      map.invalidateSize()
    }

    map.invalidateSize()

    const retry = window.setTimeout(() => {
      map.invalidateSize()
    }, 100)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.clearTimeout(retry)
    }
  }, [map])

  return null
}
