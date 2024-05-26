import { Button } from '@nextui-org/react'

export function Pagination({
  page,
  previous,
  next,
}: {
  page: number
  previous: any
  next: any
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
