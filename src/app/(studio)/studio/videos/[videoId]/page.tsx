import { VideoView } from "@/modules/studio/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

export const dynamic = "force-dynamic";
export default async function VideoCreationPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();
  
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
