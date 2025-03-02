import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ListIcon } from "lucide-react";

export function SubscriptionsSectionSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton>
            <Skeleton className="size-6 rounded-full shrink-0" />
            <Skeleton className="w-full h-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export function SubscriptionsSection() {
  const pathname = usePathname();

  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const isActive = (path: string) => pathname === path;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && <SubscriptionsSectionSkeleton />}
          {!isLoading &&
            data?.pages
              .flatMap((page) => page.items)
              .map((subscription) => (
                <SidebarMenuItem
                  key={`${subscription.creatorId}-${subscription.viewerId}`}
                >
                  <SidebarMenuButton
                    tooltip={subscription.user.name}
                    asChild
                    isActive={isActive(`/users/${subscription.user.id}`)}
                  >
                    <Link
                      href={`/users/${subscription.user.id}`}
                      className="flex items-center gap-4"
                    >
                      <UserAvatar
                        size="xs"
                        imageUrl={subscription.user.imageUrl}
                        name={subscription.user.name}
                      />
                      <span className="text-sm font-medium">
                        {subscription.user.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          {!isLoading && data?.pages[0].items.length === 0 && (
            <SidebarMenuItem>
              <SidebarMenuButton>No subscriptions</SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {!isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/subscriptions")}>
                <Link
                  prefetch
                  href="/subscriptions"
                  className="flex items-center gap-4"
                >
                  <ListIcon className="size-4" />
                  <span className="text-sm font-medium">All subscriptions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
