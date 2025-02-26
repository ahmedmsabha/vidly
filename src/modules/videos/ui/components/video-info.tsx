import { VideoGetManyOutput } from "@/modules/videos/types";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { UserAvatar } from "@/components/user-avatar";
import UserInfo from "@/modules/users/ui/components/user-info";
import Link from "next/link";
import VideoMenu from "./video-menu";
interface VideoInfoProps {
  video: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export function VideoInfo({ video, onRemove }: VideoInfoProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video.viewCount);
  }, [video.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, { addSuffix: true });
  }, [video.createdAt]);

  return (
    <div className="flex gap-3">
      <Link href={`/users/${video.user.id}`}>
        <UserAvatar imageUrl={video.user.imageUrl} name={video.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/videos/${video.id}`}>
          <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
            {video.title}
          </h3>
        </Link>
        <Link href={`/users/${video.user.id}`}>
          <UserInfo name={video.user.name} size="sm" />
        </Link>
        <Link href={`/videos/${video.id}`}>
          <p className="text-xs text-muted-foreground mt-1">
            {compactViews} views • {compactDate}
          </p>
        </Link>
      </div>
      <div className="shrink-0">
        <VideoMenu videoId={video.id} onRemove={onRemove} />
      </div>
    </div>
  );
}
