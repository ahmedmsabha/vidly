import Image from "next/image";
import thumbnail from "@/assets/images/placeholder.svg";
import { formatDuration } from "@/lib/utils";
interface VideoThumbnailProps {
  title: string;
  duration: number;
  imageUrl?: string | null;
  previewUrl?: string | null;
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="relative">
      <div className="relative overflow-hidden w-full rounded-xl aspect-video">
        <Image
          src={imageUrl ?? thumbnail}
          alt={title}
          fill
          className="h-full w-full object-cover group-hover:opacity-0"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl ?? thumbnail}
          alt={title}
          fill
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      <div className="absolute bottom-2 right-2 px-1 py-0.5 text-white bg-black/80 rounded text-xs font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
};
