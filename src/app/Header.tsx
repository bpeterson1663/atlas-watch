import { Box, Group, Text, ThemeIcon } from '@mantine/core'
import { IconWorld } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import layout from '../styles/layout.module.css'
import classes from './Header.module.css'

function HeaderNavLink({
  to,
  label,
  shortLabel,
  matchPath,
}: {
  to: string
  label: string
  shortLabel?: string
  matchPath: string
}) {
  const location = useLocation()
  const active = location.pathname === matchPath

  return (
    <Link
      to={to}
      aria-label={label}
      className={`${classes.link}${active ? ` ${classes.linkActive}` : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className={classes.labelFull}>{label}</span>
      <span className={classes.labelShort}>{shortLabel ?? label}</span>
    </Link>
  )
}

export function Header() {
  return (
    <Box className={classes.shell}>
      <Group
        className={`${classes.root} ${layout.container}`}
        justify="space-between"
        align="center"
        wrap="nowrap"
        gap="sm"
      >
        <Link to="/" className={classes.brand}>
          <ThemeIcon variant="light" color="navy" size={32} radius="md">
            <IconWorld size={18} />
          </ThemeIcon>
          <div className={classes.brandText}>
            <Text fw={700} size="md" lh={1.15}>
              Atlas Watch
            </Text>
            <Text size="xs" c="dimmed" lh={1.2} className={classes.tagline}>
              Explore active natural events around the world
            </Text>
          </div>
        </Link>

        <nav className={classes.nav} aria-label="Primary">
          <HeaderNavLink to="/" label="Dashboard" matchPath="/" />
          <HeaderNavLink
            to="/explorer"
            label="Event Explorer"
            shortLabel="Explorer"
            matchPath="/explorer"
          />
        </nav>
      </Group>
    </Box>
  )
}
