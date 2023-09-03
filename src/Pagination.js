import { Button } from "@nextui-org/react";

export function Pagination({ category, page, previous, next }) {
  return (
    category != "watched" && (
      <div className="buttons">
        <Button isDisabled={page < 2} onClick={previous}>
          PREVIOUS
        </Button>
        {page}
        <Button onClick={next}>NEXT</Button>
      </div>
    )
  );
}
