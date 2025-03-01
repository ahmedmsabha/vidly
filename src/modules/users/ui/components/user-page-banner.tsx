import { cn } from "@/lib/utils";
import { UserGetOneOutput } from "../../types";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BannerUploadModel } from "./banner-upload-model";
import { useState } from "react";
interface UserPageBannerProps {
  user: UserGetOneOutput;
}

export const UserPageBannerSkeleton = () => {
  return <Skeleton className="max-h-[200px] h-[15vh] md:h-[25vh] w-full" />;
};
export function UserPageBanner({ user }: UserPageBannerProps) {
  const { userId } = useAuth();
  const [isBannerUploadModelOpen, setIsBannerUploadModelOpen] = useState(false);

  return (
    <div className="relative group">
      <BannerUploadModel
        userId={user.id}
        open={isBannerUploadModelOpen}
        onOpenChange={setIsBannerUploadModelOpen}
      />
      <div
        className={cn(
          "relative max-h-[200px] h-[15vh] md:h-[25vh] w-full rounded-xl bg-gradient-to-r from-gray-100 to-gray-200",
          user.bannerUrl ? "bg-cover bg-center" : "bg-gray-100"
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {user.clerkId === userId && (
          <Button
            onClick={() => setIsBannerUploadModelOpen(true)}
            variant="outline"
            size="icon"
            type="button"
            className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Edit2Icon className="w-4 h-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
}
