import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { ChevronDownIcon } from "./ChevronDownicon";

export function TorrentButon({ result, dropDownOpen, setDropDownOpen }) {
  return (
    result.torrentDetails?.seeds > 0 && (
      <ButtonGroup variant="flat">
        <Tooltip
          isDisabled={dropDownOpen}
          placement="bottom"
          content={
            <div className="px-1 py-2">
              <div className="text-small font-bold">Download</div>
              <div className="text-tiny">{result.torrentDetails.title}</div>
              <div className="text-tiny">{result.torrentDetails.size}</div>
            </div>
          }
        >
          <Button
            variant="bordered"
            onClick={() =>
              (window.location.href = result.torrentDetails.magnet)
            }
          >
            Download ({result.torrentDetails.size})
          </Button>
        </Tooltip>
        <Dropdown placement="bottom-end" onOpenChange={setDropDownOpen}>
          <DropdownTrigger>
            <Button isIconOnly>
              <ChevronDownIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Merge options"
            selectionMode="single"
            className="max-w-[300px]"
          >
            <DropdownItem
              description={result.torrentDetails?.title}
              key="pirate"
              onClick={() =>
                (window.location.href = result.torrentDetails.magnet)
              }
            >
              ThePirateBay
            </DropdownItem>
            <DropdownItem
              description={result.torrentDetails.torrent9?.title}
              key="torrent9"
              onClick={() =>
                (window.location.href = result.torrentDetails.torrent9?.magnet)
              }
            >
              Torrent9
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>
    )
  );
}
