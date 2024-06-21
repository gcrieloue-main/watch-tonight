import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react'
import { useState } from 'react'

export function GenreSelector({
  setGenre,
  isDisabled = false,
}: {
  setGenre: (number) => void
  isDisabled: boolean
}) {
  const [selectedKey, setSelectedKey] = useState(0)
  const genres = [
    { key: 0, label: 'All genres' },
    { key: 27, label: 'Horror' },
    { key: 28, label: 'Action' },
    { key: 16, label: 'Animation' },
    { key: 878, label: 'Sci-fi' },
  ]

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {isDisabled
            ? 'N/A'
            : genres.find((genre) => genre.key === selectedKey).label}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        disabledKeys={[0]}
        selectedKeys={[0]}
        onSelectionChange={(selection) => {
          if (!isDisabled) {
            const genreId = +Array.from(selection)[0]
            setSelectedKey(genreId)
            setGenre(genreId)
          }
        }}
      >
        {genres.map((genre) => (
          <DropdownItem key={genre.key}>{genre.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
