import { StudioView } from "@/modules/studio/ui/views/studio-view";
import { HydrateClient } from "@/trpc/server";
import React from "react";

export default async function StudioPage() {
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
}
