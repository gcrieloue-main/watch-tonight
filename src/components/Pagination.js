import { Button } from "@nextui-org/react";

export function Pagination({ page, previous, next, isLoading }) {
  return (
    <div className="buttons">
      <Button isDisabled={page < 2 || isLoading} onClick={previous}>
        PREVIOUS
      </Button>
      {page}
      <Button onClick={next} isDisabled={isLoading}>
        NEXT
      </Button>
    </div>
  );
}
