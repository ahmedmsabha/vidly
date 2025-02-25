import GVideoView from "@/modules/videos/ui/views/gvideo-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({ id: videoId });
  void trpc.comments.getMany.prefetch({ videoId });

  return (
    <HydrateClient>
      <GVideoView videoId={videoId} />
    </HydrateClient>
  );
}
