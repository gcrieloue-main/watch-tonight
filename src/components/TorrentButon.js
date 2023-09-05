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
  return desc?.replaceAll(".", " ").replaceAll("5 1", "5.1");
}

export function TorrentButon({ result }) {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const firstTorrent = Object.values(result.torrentDetails)[0];

  return (
    firstTorrent?.seeds > 0 && (
      <ButtonGroup variant="flat">
        <Tooltip
          isDisabled={dropDownOpen}
          placement="bottom"
          content={
            <div className="px-1 py-2">
              <div className="text-small font-bold">Download</div>
              <div className="text-tiny">{firstTorrent.title}</div>
              <div className="text-tiny">{firstTorrent.size}</div>
            </div>
          }
        >
          <Button
            variant="bordered"
            onClick={() => (window.location.href = firstTorrent.magnet)}
          >
            Download ({firstTorrent.size})
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
            {Object.keys(result.torrentDetails).map((key) => (
              <DropdownItem
                description={formatTorrentName(
                  result.torrentDetails[key]?.title,
                )}
                key={key}
                onClick={() =>
                  (window.location.href = result.torrentDetails[key].magnet)
                }
              >
                {key}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>
    )
  );
}
