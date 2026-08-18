import { Box } from '@mantine/core'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  fixedHeight?: number
}

export function MapPane({ children, fixedHeight }: Props) {
  const isFixed = fixedHeight != null

  return (
    <Box
      flex={isFixed ? undefined : 2}
      h={isFixed ? fixedHeight : '100%'}
      style={{
        borderRadius: 8,
        overflow: 'hidden',
        flexShrink: isFixed ? 0 : undefined,
        minHeight: isFixed ? fixedHeight : 0,
        border: '1px solid var(--mantine-color-gray-3)',
      }}
    >
      {children}
    </Box>
  )
}
