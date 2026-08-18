import { Box } from '@mantine/core'
import type { ReactNode } from 'react'
import classes from './MapPane.module.css'

interface Props {
  children: ReactNode
  fixedHeight?: number
}

export function MapPane({ children, fixedHeight }: Props) {
  const isFixed = fixedHeight != null

  return (
    <Box
      className={`${classes.root}${isFixed ? ` ${classes.fixed}` : ''}`}
      flex={isFixed ? undefined : 2}
      h={isFixed ? fixedHeight : '100%'}
      mih={isFixed ? fixedHeight : 0}
    >
      {children}
    </Box>
  )
}
