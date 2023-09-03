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
import { useState } from "react";

function formatTorrentName(desc) {
  return desc.replaceAll(".", " ").replaceAll("5 1", "5.1");
}

export function TorrentButon({ result }) {
  const [dropDownOpen, setDropDownOpen] = useState(false);

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
        <Dropdown
          placement="bottom-end"
          onOpenChange={setDropDownOpen}
          className="dark text-foreground bg-background"
        >
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
              description={formatTorrentName(result.torrentDetails?.title)}
              key="pirate"
              onClick={() =>
                (window.location.href = result.torrentDetails.magnet)
              }
            >
              ThePirateBay
            </DropdownItem>
            <DropdownItem
              description={formatTorrentName(
                result.torrentDetails.torrent9?.title,
              )}
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
