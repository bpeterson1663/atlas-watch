import { ActionIcon, Button, Checkbox, Menu } from '@mantine/core'
import { IconChevronDown, IconWorld, IconX } from '@tabler/icons-react'
import type { Category } from '../types/category'
import classes from './CategoryFilter.module.css'

interface Props {
  categories: Category[]
  value: string[]
  onChange: (value: string[]) => void
}

export function CategoryFilter({ categories, value, onChange }: Props) {
  const selectedTitles = categories
    .filter((category) => value.includes(category.id))
    .map((category) => category.title)

  const label =
    selectedTitles.length === 0
      ? 'All categories'
      : selectedTitles.length === 1
        ? selectedTitles[0]
        : `${selectedTitles.length} categories`

  function toggle(id: string) {
    onChange(
      value.includes(id)
        ? value.filter((categoryId) => categoryId !== id)
        : [...value, id],
    )
  }

  return (
    <Menu
      withinPortal
      shadow="sm"
      width={240}
      position="bottom-start"
      zIndex={2000}
    >
      <Menu.Target>
        <Button
          className={classes.trigger}
          variant="default"
          size="sm"
          justify="space-between"
          leftSection={<IconWorld size={16} />}
          rightSection={
            value.length > 0 ? (
              <ActionIcon
                size="xs"
                variant="transparent"
                color="gray"
                aria-label="Clear categories"
                onClick={(event) => {
                  event.stopPropagation()
                  onChange([])
                }}
              >
                <IconX size={14} />
              </ActionIcon>
            ) : (
              <IconChevronDown size={14} />
            )
          }
        >
          {label}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {categories.map((category) => (
          <Menu.Item
            key={category.id}
            closeMenuOnClick={false}
            onClick={() => toggle(category.id)}
            leftSection={
              <Checkbox
                size="xs"
                checked={value.includes(category.id)}
                readOnly
                tabIndex={-1}
              />
            }
          >
            {category.title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
