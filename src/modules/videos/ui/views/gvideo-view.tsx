import React from "react";
import VideoSection from "../sections/video-section";
import SuggestionsSection from "../sections/suggestions-section";
import { CommentsSection } from "../sections/comments-section";
export default function GVideoView({ videoId }: { videoId: string }) {
  return (
    <div className="flex flex-col mx-auto max-w-[1700px] pt-2.5 px-4 mb-10">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex-1 min-w-0">
          <VideoSection videoId={videoId} />
          <div className="xl:hidden block mt-4">
            <SuggestionsSection />
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
          <SuggestionsSection />
        </div>
      </div>
    </div>
  );
}
