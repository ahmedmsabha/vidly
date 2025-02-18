import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { videos } from "@/db/schema";
import { db } from "@/db";
import { mux } from "@/lib/mux";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const {
      user: { id: userId },
    } = ctx;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
      },
      cors_origin: "*", // TODO: in production, set to url
    });

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();
    return { video, url: upload.url };
  }),
});
