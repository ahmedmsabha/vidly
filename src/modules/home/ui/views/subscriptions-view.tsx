import React from "react";
import { SubscriptionVideosSection } from "../sections/subscription-videos-section";

export function SubscriptionsView() {
  return (
    <div className="max-w-[2000px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-xs text-gray-500">
          Videos from creators you follow.
        </p>
      </div>
      <SubscriptionVideosSection />
    </div>
  );
}
