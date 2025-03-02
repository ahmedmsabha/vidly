"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { toast } from "sonner";
import Link from "next/link";
import {
  SubscriptionItem,
  SubscriptionItemSkeleton,
} from "../components/subscription-item";

export function SubscriptionsSection() {
  return (
    <Suspense fallback={<SubscriptionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Something went wrong...</p>}>
        <SubscriptionsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

export function SubscriptionsSectionSkeleton() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SubscriptionItemSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function SubscriptionsSectionSuspense() {
  const utils = trpc.useUtils();
  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      toast.success("Unsubscribed");
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: data.creatorId });
    },
    onError: () => {
      toast.error("Failed to unsubscribe");
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4">
        {subscriptions.pages
          .flatMap((page) => page.items)
          .map((subscription) => (
            <Link
              key={subscription.creatorId}
              href={`/users/${subscription.creatorId}`}
            >
              <SubscriptionItem
                name={subscription.user.name}
                imageUrl={subscription.user.imageUrl}
                subscriberCount={subscription.user.subscriberCount}
                onUnsubscribe={() =>
                  unsubscribe.mutate({ userId: subscription.creatorId })
                }
                disabled={unsubscribe.isPending}
              />
            </Link>
          ))}
      </div>

      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
}
