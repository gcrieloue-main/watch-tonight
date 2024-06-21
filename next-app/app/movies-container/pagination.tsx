import { Button } from '@nextui-org/react'

export function Pagination({
  page,
  previous,
  next,
}: {
  page: number
  previous: () => void
  next: () => void
}) {
  return (
    <div className="buttons">
      <Button isDisabled={page < 2} onClick={previous}>
        PREVIOUS
      </Button>
      {page}
      <Button onClick={next}>NEXT</Button>
    </div>
  )
}
