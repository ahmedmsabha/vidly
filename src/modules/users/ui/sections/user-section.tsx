"use client";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  UserPageBanner,
  UserPageBannerSkeleton,
} from "../components/user-page-banner";
import {
  UserPageInfo,
  UserPageInfoSkeleton,
} from "../components/user-page-info";
import { Separator } from "@/components/ui/separator";
export function UserSection({ userId }: { userId: string }) {
  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong...</div>}>
        <UserSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function UserSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <UserPageBannerSkeleton />
      <UserPageInfoSkeleton />
    </div>
  );
}

function UserSectionSuspense({ userId }: { userId: string }) {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });

  return (
    <div className="flex flex-col gap-4">
      <UserPageBanner user={user} />
      <UserPageInfo user={user} />
      <Separator />
    </div>
  );
}
