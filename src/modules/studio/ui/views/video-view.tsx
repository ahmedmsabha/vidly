import React from "react";
import { FormSection } from "@/modules/studio/ui/views/form-section";

export function VideoView({ videoId }: { videoId: string }) {
  return (
    <div className="px-4 pt-2.5 max-w-screen-lg">
      <FormSection videoId={videoId} />
    </div>
  );
}
