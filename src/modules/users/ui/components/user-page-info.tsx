import { useAuth, useClerk } from "@clerk/nextjs";
import type { UserGetOneOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SubscriptionButton from "@/modules/subscriptions/ui/components/subscription-button";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
interface UserPageInfoProps {
  user: UserGetOneOutput;
}

export function UserPageInfoSkeleton() {
  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>
        <Skeleton className="h-10 w-full mt-3 rounded-full" />
      </div>
      <div className="hidden md:flex items-start gap-4">
        <Skeleton className="h-[160px] w-[160px] rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48 mt-4" />
          <Skeleton className="h-10 w-32 mt-3 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function UserPageInfo({ user }: UserPageInfoProps) {
  const { userId, isLoaded } = useAuth();
  const clerk = useClerk();

  const { onClick, isPending } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  });

  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            imageUrl={user.imageUrl}
            name={user.name}
            size="lg"
            className="w-16 h-16"
            onClick={() => {
              if (userId === user.clerkId) {
                clerk.openUserProfile();
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{user.name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>{user.subscriberCount} subscribers</span>
              <span>&bull;</span>
              <span>{user.videoCount} videos</span>
            </div>
          </div>
        </div>
        {userId === user.clerkId ? (
          <div className="mt-4">
            <Button
              variant="secondary"
              asChild
              className="w-full mt-3 rounded-full"
            >
              <Link href="/studio">Go to Studio</Link>
            </Button>
          </div>
        ) : (
          <SubscriptionButton
            onClick={onClick}
            disabled={isPending || !isLoaded}
            isSubscribed={user.viewerSubscribed}
            className="w-full mt-3"
          />
        )}
      </div>
      <div className="hidden md:flex items-start gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            onClick={() => {
              if (userId === user.clerkId) {
                clerk.openUserProfile();
              }
            }}
            imageUrl={user.imageUrl}
            name={user.name}
            size="xl"
            className={cn(
              userId === user.clerkId &&
                "cursor-pointer hover:opacity-75 transition-opacity duration-300"
            )}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold truncate">{user.name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
              <span>{user.subscriberCount} subscribers</span>
              <span>&bull;</span>
              <span>{user.videoCount} videos</span>
            </div>

            {userId === user.clerkId ? (
              <div>
                <Button
                  variant="secondary"
                  asChild
                  className="mt-3 rounded-full"
                >
                  <Link href="/studio">Go to Studio</Link>
                </Button>
              </div>
            ) : (
              <SubscriptionButton
                onClick={onClick}
                disabled={isPending || !isLoaded}
                isSubscribed={user.viewerSubscribed}
                className="mt-3"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
