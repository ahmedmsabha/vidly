"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PlaylistCreateModel } from "../components/playlist-create-model";
import { PlaylistsSection } from "../sections/playlists-section";
export default function PlaylistsView() {
  const [openCreateModel, setOpenCreateModel] = React.useState(false);
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModel
        open={openCreateModel}
        onOpenChange={setOpenCreateModel}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-xs text-gray-500">
            Collections of videos you have created.
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setOpenCreateModel(true)}
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistsSection />
    </div>
  );
}
