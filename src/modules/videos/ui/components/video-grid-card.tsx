import { VideoGetManyOutput } from "@/modules/videos/types";
import { VideoThumbnail, VideoThumbnailSkeleton } from "./video-thumbnail";
import { VideoInfo, VideoInfoSkeleton } from "./video-info";
import Link from "next/link";

interface VideoGridCardProps {
  video: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export function VideoGridCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <VideoThumbnailSkeleton />
      <VideoInfoSkeleton />
    </div>
  );
}
export function VideoGridCard({ video, onRemove }: VideoGridCardProps) {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link prefetch href={`/videos/${video.id}`}>
        <VideoThumbnail
          imageUrl={video.thumbnailUrl}
          previewUrl={video.previewUrl}
          title={video.title}
          duration={video.duration ?? 0}
        />
      </Link>
      <VideoInfo video={video} onRemove={onRemove} />
    </div>
  );
}
