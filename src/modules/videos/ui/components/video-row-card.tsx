import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { VideoGetManyOutput } from "@/modules/videos/types";
import Link from "next/link";
import {
  VideoThumbnail,
  VideoThumbnailSkeleton,
} from "@/modules/videos/ui/components/video-thumbnail";
import { UserAvatar } from "@/components/user-avatar";
import UserInfo from "@/modules/users/ui/components/user-info";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import VideoMenu from "./video-menu";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
const videoRowCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbnailVariants = cva("relative flex-none", {
  variants: {
    size: {
      default: "w-[38%]",
      compact: "w-[168px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  video: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export function VideoRowCardSkelton({
  size = "default",
}: VariantProps<typeof videoRowCardVariants>) {
  return (
    <div className={cn(videoRowCardVariants({ size }))}>
      <div className={cn(thumbnailVariants({ size }))}>
        <VideoThumbnailSkeleton />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Skeleton
              className={cn("h-5 w-[40%]", size === "compact" && "h-4 w-[40%]")}
            />
            {size === "default" && (
              <>
                <Skeleton className="h-4 w-[20%] mt-1" />
                <div className="flex items-center gap-2 my-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </>
            )}
            {size === "compact" && (
              <>
                <Skeleton className="h-4 w-[50%] mt-1" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoRowCard({
  video,
  size = "default",
  onRemove,
}: VideoRowCardProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video.viewCount);
  }, [video.viewCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(video.likeCount);
  }, [video.likeCount]);

  return (
    <div className={cn(videoRowCardVariants({ size }))}>
      <Link href={`/videos/${video.id}`}>
        <div className={cn(thumbnailVariants({ size }))}>
          <VideoThumbnail
            imageUrl={video.thumbnailUrl}
            previewUrl={video.previewUrl}
            title={video.title}
            duration={video.duration ?? 0}
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link href={`/videos/${video.id}`}>
            <h3
              className={cn(
                "font-medium line-clamp-2",
                size === "default" && "text-sm",
                size === "compact" && "text-xs"
              )}
            >
              {video.title}
            </h3>
            {size === "default" && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
            {size === "default" && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <UserAvatar
                    imageUrl={video.user.imageUrl}
                    name={video.user.name}
                    size="sm"
                  />
                  <UserInfo name={video.user.name} size="sm" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground w-fit line-clamp-2">
                        {video.description ?? "No description"}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="start"
                    ></TooltipContent>
                  </Tooltip>
                </div>
              </>
            )}
            {size === "compact" && (
              <UserInfo name={video.user.name} size="sm" />
            )}
            {size === "compact" && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
          </Link>
          <div className="flex-none">
            <VideoMenu videoId={video.id} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
}
