import { Box } from '@mantine/core'
import type { ReactNode } from 'react'
import classes from './MapPane.module.css'

interface Props {
  children: ReactNode
  fixedHeight?: number
  minHeight?: number
  flex?: number
}

export function MapPane({ children, fixedHeight, minHeight, flex = 2 }: Props) {
  const isFixed = fixedHeight != null

  return (
    <Box
      className={`${classes.root}${isFixed ? ` ${classes.fixed}` : ''}`}
      flex={isFixed ? undefined : flex}
      h={isFixed ? fixedHeight : '100%'}
      mih={isFixed ? fixedHeight : minHeight}
    >
      {children}
    </Box>
  )
}
