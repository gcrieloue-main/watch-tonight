import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react'

export function GenreSelector({
  selectedGenre,
  setGenre,
  isDisabled = false,
}: {
  selectedGenre: number
  setGenre: (number) => void
  isDisabled: boolean
}) {
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
            : genres.find((genre) => genre.key === selectedGenre)?.label}
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
