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
  return desc?.replaceAll(".", ". ");
}

export function TorrentButon({ torrentDetails }) {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const firstTorrent = Object.values(torrentDetails)[0];

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
            {Object.keys(torrentDetails).map((key) => (
              <DropdownItem
                description={formatTorrentName(`${torrentDetails[key]?.title}`)}
                key={key}
                onClick={() =>
                  (window.location.href = torrentDetails[key].magnet)
                }
              >
                {torrentDetails[key]?.size} ({torrentDetails[key]?.seeds} seeds)
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>
    )
  );
}
