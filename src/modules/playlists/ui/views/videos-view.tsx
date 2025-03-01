import React from "react";
import { VideosSection } from "../sections/videos-section";
import { PlaylistHeaderSection } from "../sections/playlist-header-section";

export function VideosView({ playlistId }: { playlistId: string }) {
  return (
    <div className="max-w-[2000px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSection playlistId={playlistId} />
      <VideosSection playlistId={playlistId} />
    </div>
  );
}
