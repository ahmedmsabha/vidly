import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVerticalIcon,
  ShareIcon,
  ListPlusIcon,
  TrashIcon,
} from "lucide-react";
import { toast } from "sonner";
import { WEBSITE_URL } from "@/constants";
import { useState } from "react";
import { PlaylistAddModel } from "@/modules/playlists/ui/components/playlist-add-model";

interface VideoMenuProps {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

export default function VideoMenu({
  videoId,
  variant = "ghost",
  onRemove,
}: VideoMenuProps) {
  const [isOpenPlaylistAddModal, setIsOpenPlaylistAddModal] = useState(false);

  function onShare() {
    const fullUrl = `${WEBSITE_URL}/videos/${videoId}`;

    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard");
  }

  return (
    <>
      <PlaylistAddModel
        open={isOpenPlaylistAddModal}
        onOpenChange={setIsOpenPlaylistAddModal}
        videoId={videoId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size="icon" className="rounded-full">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DropdownMenuItem onClick={onShare}>
            <ShareIcon className="size-4 mr-2" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpenPlaylistAddModal(true)}>
            <ListPlusIcon className="size-4 mr-2" />
            Add to playlist
          </DropdownMenuItem>
          {onRemove && (
            <DropdownMenuItem onClick={onRemove}>
              <TrashIcon className="size-4 mr-2" />
              Remove
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
