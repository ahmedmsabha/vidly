import { UserView } from "@/modules/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  void trpc.users.getOne.prefetch({ id: userId });
  void trpc.videos.getMany.prefetch({
    userId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
}
