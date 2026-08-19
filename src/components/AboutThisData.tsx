import { Popover, Stack, Text, UnstyledButton } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import classes from './AboutThisData.module.css'

export function AboutThisData() {
  return (
    <Popover width={320} position="bottom-end" shadow="md" zIndex={2000}>
      <Popover.Target>
        <UnstyledButton
          className={classes.trigger}
          aria-label="About this data"
        >
          <IconInfoCircle size={16} />
          <span className={classes.label}>About this data</span>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="sm">
          <Text size="sm" fw={600}>
            About this data
          </Text>
          <Definition
            term="Events"
            meaning="A named natural phenomenon EONET is tracking, such as a wildfire or storm."
          />
          <Definition
            term="Observations"
            meaning="Dated locations (and sometimes magnitude) for that event. Storms often have many points; a wildfire may have one."
          />
          <Definition
            term="Status"
            meaning="Open means the source still considers the event active. Closed means it has an end date."
          />
          <Definition
            term="Sources"
            meaning="The agencies that reported the event (IRWIN, GDACS, JTWC, and others). NASA EONET aggregates those reports; it does not generate the observations."
          />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

function Definition({ term, meaning }: { term: string; meaning: string }) {
  return (
    <Text size="xs">
      <Text span fw={600}>
        {term}.{' '}
      </Text>
      {meaning}
    </Text>
  )
}
