import { StudioView } from "@/modules/studio/ui/views/studio-view";
import { HydrateClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
import React from "react";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
}
