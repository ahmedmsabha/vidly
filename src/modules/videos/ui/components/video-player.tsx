import React from "react";
import MuxPlayer from "@mux/mux-player-react";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/types";
interface VideoPlayerProps {
  playbackId?: string | null;
  posterUrl?: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayerSkeleton = () => {
  return <div className="rounded-xl bg-black animate-pulse aspect-video" />;
};

export function VideoPlayer({
  playbackId,
  posterUrl: thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) {
  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className="w-full h-full object-contain"
      accentColor="#FF2056"
      onPlay={onPlay}
    />
  );
}
