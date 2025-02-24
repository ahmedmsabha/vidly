"use client";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoPlayer from "../components/video-player";
import VideoBanner from "../components/video-banner";
import VideoTopRow from "../components/video-top-row";

export default function VideoSection({ videoId }: { videoId: string }) {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error loading video</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function VideoSectionSkeleton() {
  return <div>Loading...</div>;
}

function VideoSectionSuspense({ videoId }: { videoId: string }) {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  console.log("video", video);
  return (
    <>
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl bg-black",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={() => {
            console.log("play");
          }}
          playbackId={video.muxPlaybackId}
          posterUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
}
