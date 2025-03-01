import { ResponsizeDialog } from "@/components/responsize-dialog";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SquareCheckIcon } from "lucide-react";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { toast } from "sonner";

interface PlaylistAddModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export const PlaylistAddModel = ({
  open,
  onOpenChange,
  videoId,
}: PlaylistAddModelProps) => {
  const {
    data: playlists,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && open,
    }
  );

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) {
      refetch();
    }
  }

  const utils = trpc.useUtils();

  const { mutate: addVideo, isPending: isAddingVideo } =
    trpc.playlists.addVideo.useMutation({
      onSuccess: (data) => {
        toast.success("Video added to playlist");
        utils.playlists.getMany.invalidate();
        utils.playlists.getManyForVideo.invalidate({ videoId });
        utils.playlists.getOne.invalidate({ playlistId: data.playlistId });
        utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const { mutate: removeVideo, isPending: isRemovingVideo } =
    trpc.playlists.removeVideo.useMutation({
      onSuccess: (data) => {
        toast.success("Video removed from playlist");
        utils.playlists.getMany.invalidate();
        utils.playlists.getManyForVideo.invalidate({ videoId });
        utils.playlists.getOne.invalidate({ playlistId: data.playlistId });
        utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <ResponsizeDialog
      title="Add to playlist"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex p-4 justify-center">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start px-2 [&_svg]:size-5"
                size="lg"
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeVideo({ playlistId: playlist.id, videoId });
                  } else {
                    addVideo({ playlistId: playlist.id, videoId });
                  }
                }}
                disabled={
                  isLoading ||
                  isFetchingNextPage ||
                  isAddingVideo ||
                  isRemovingVideo
                }
              >
                {playlist.containsVideo ? (
                  <SquareCheckIcon className="mr-2" />
                ) : (
                  <SquareIcon className="mr-2" />
                )}
                {playlist.name}
              </Button>
            ))}
        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isManual
          />
        )}
      </div>
    </ResponsizeDialog>
  );
};
