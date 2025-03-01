"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2Icon, Loader2Icon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export function PlaylistHeaderSection({ playlistId }: { playlistId: string }) {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Something went wrong...</p>}>
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
}

export function PlaylistHeaderSectionSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-y-2">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-32 h-6 rounded-full" />
      </div>
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
  );
}

export function PlaylistHeaderSectionSuspense({
  playlistId,
}: {
  playlistId: string;
}) {
  console.log(playlistId);
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ playlistId });

  const router = useRouter();
  const utils = trpc.useUtils();
  const remove = trpc.playlists.removePlaylist.useMutation({
    onSuccess: () => {
      toast.success("Playlist deleted successfully");
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: () => {
      toast.error("Something went wrong...");
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-xs text-gray-500">Videos from your playlist.</p>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => remove.mutate({ playlistId })}
        disabled={remove.isPending}
      >
        {remove.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <Trash2Icon />
        )}
      </Button>
    </div>
  );
}
