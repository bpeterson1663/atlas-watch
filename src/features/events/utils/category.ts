import {
  IconDroplet,
  IconFlame,
  IconIceberg,
  IconMountain,
  IconTornado,
  IconWorld,
} from '@tabler/icons-react'

export function categoryStyle(categoryId: string) {
  switch (categoryId) {
    case 'wildfires':
      return { color: 'wildfire', hex: '#fd7e14', icon: IconFlame }
    case 'severeStorms':
      return { color: 'storm', hex: '#228be6', icon: IconTornado }
    case 'volcanoes':
      return { color: 'volcano', hex: '#7950f2', icon: IconMountain }
    case 'floods':
      return { color: 'flood', hex: '#12b886', icon: IconDroplet }
    case 'seaLakeIce':
      return { color: 'navy', hex: '#1b365d', icon: IconIceberg }
    default:
      return { color: 'navy', hex: '#1b365d', icon: IconWorld }
  }
}
