import {
  IconDroplet,
  IconFlame,
  IconIceCream,
  IconMountain,
  IconTornado,
  IconWorld,
} from '@tabler/icons-react'

export function categoryStyle(categoryId: string) {
  switch (categoryId) {
    case 'wildfires':
      return { color: 'wildfire', icon: IconFlame }
    case 'severeStorms':
      return { color: 'storm', icon: IconTornado }
    case 'volcanoes':
      return { color: 'volcano', icon: IconMountain }
    case 'floods':
      return { color: 'flood', icon: IconDroplet }
    case 'seaLakeIce':
      return { color: 'navy', icon: IconIceCream }
    default:
      return { color: 'navy', icon: IconWorld }
  }
}
