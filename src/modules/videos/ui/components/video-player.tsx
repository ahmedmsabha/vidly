import React from "react";
import MuxPlayer from "@mux/mux-player-react";
import thumbnailPlaceholder from "@/assets/images/placeholder.svg";

interface VideoPlayerProps {
  playbackId?: string | null;
  posterUrl?: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export default function VideoPlayer({
  playbackId,
  posterUrl: thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) {
  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl || thumbnailPlaceholder}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className="w-full h-full object-contain"
      accentColor="#FF2056"
      onPlay={onPlay}
    />
  );
}
