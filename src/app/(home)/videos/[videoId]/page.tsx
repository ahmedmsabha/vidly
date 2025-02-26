import { DEFAULT_LIMIT } from "@/constants";
import GVideoView from "@/modules/videos/ui/views/gvideo-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({ id: videoId });
  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <GVideoView videoId={videoId} />
    </HydrateClient>
  );
}
