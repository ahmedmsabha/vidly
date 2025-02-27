import type { PlaylistGetManyOutput } from "@/modules/playlists/types";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/types";
import Link from "next/link";
import {
  PlaylistThumbnail,
  PlaylistThumbnailSkeleton,
} from "./playlist-thumbnail";
import { PlaylistInfo, PlaylistInfoSkeleton } from "./playlist-info";

interface PlaylistGridCardProps {
  playlist: PlaylistGetManyOutput["items"][number];
}

export function PlaylistGridCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
}
export function PlaylistGridCard({ playlist }: PlaylistGridCardProps) {
  return (
    <Link href={`/playlists/${playlist.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          imageUrl={playlist.thumbnailUrl || THUMBNAIL_FALLBACK}
          title={playlist.name}
          videoCount={playlist.videoCount}
        />
        <PlaylistInfo playlist={playlist} />
      </div>
    </Link>
  );
}
