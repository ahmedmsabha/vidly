import { z } from "zod";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import {
  videos,
  videoUpdateSchema,
  videoReactions,
  subscriptions,
} from "@/db/schema";
import { db } from "@/db";
import { mux } from "@/lib/mux";
import {
  desc,
  and,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  lt,
  or,
} from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/qstash";
import { users, videoViews } from "@/db/schema";

export const videosRouter = createTRPCRouter({
  getManySubscribed: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const viewerSubscriptions = db.$with("viewer_subscriptions").as(
        db
          .select({
            userId: subscriptions.creatorId,
          })
          .from(subscriptions)
          .where(eq(subscriptions.viewerId, userId))
      );
      const data = await db
        .with(viewerSubscriptions)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.userId, users.id)
        )
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getManyTrending: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            viewCount: z.number(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit } = input;

      const viewCountSubquery = db.$count(
        videoViews,
        eq(videoViews.videoId, videos.id)
      );

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: viewCountSubquery,
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(viewCountSubquery, cursor.viewCount),
                  and(
                    eq(viewCountSubquery, cursor.viewCount),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewCountSubquery), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            viewCount: lastItem.viewCount,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        categoryId: z.string().uuid().nullish(),
        userId: z.string().uuid().nullish(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { categoryId, cursor, limit, userId } = input;

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(
          and(
            eq(videos.visibility, "public"),
            categoryId ? eq(videos.categoryId, categoryId) : undefined,
            userId ? eq(videos.userId, userId) : undefined,
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { id: videoId } = input;
      const { clerkUserId } = ctx;

      let userId;

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) {
        userId = user.id;
      }

      const viewerReactions = db.$with("viewer_reactions").as(
        db
          .select({
            type: videoReactions.type,
            videoId: videoReactions.videoId,
          })
          .from(videoReactions)
          .where(inArray(videoReactions.userId, userId ? [userId] : []))
      );

      const viewerSubscriptions = db.$with("viewer_subscriptions").as(
        db
          .select()
          .from(subscriptions)
          .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
      );

      const [existingVideo] = await db
        .with(viewerReactions, viewerSubscriptions)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
            subscriberCount: db.$count(
              subscriptions,
              eq(subscriptions.creatorId, users.id)
            ),
            viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
              Boolean
            ),
          },
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
          viewerReaction: viewerReactions.type,
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
        .leftJoin(
          viewerSubscriptions,
          eq(viewerSubscriptions.creatorId, users.id)
        )
        .where(and(eq(videos.id, videoId)));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }
      return existingVideo;
    }),
  generateTitle: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: videoId } = input;
      const {
        user: { id: userId },
      } = ctx;

      const url = `${process.env
        .UPSTASH_WORKFLOW_URL!}/api/videos/workflows/title`;

      console.log(url);
      const { workflowRunId } = await workflow.trigger({
        url,
        body: { userId, videoId },
      });
      return workflowRunId;
    }),
  generateDescription: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: videoId } = input;
      const {
        user: { id: userId },
      } = ctx;

      const url = `${process.env
        .UPSTASH_WORKFLOW_URL!}/api/videos/workflows/description`;

      const { workflowRunId } = await workflow.trigger({
        url,
        body: { userId, videoId },
      });
      return workflowRunId;
    }),
  generateThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid(), prompt: z.string().min(10) }))
    .mutation(async ({ ctx, input }) => {
      const { id: videoId, prompt } = input;
      const {
        user: { id: userId },
      } = ctx;

      const url = `${process.env
        .UPSTASH_WORKFLOW_URL!}/api/videos/workflows/thumbnail`;

      console.log(url);

      const { workflowRunId } = await workflow.trigger({
        url,
        body: { userId, videoId, prompt },
      });
      return workflowRunId;
    }),
  revalidate: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const {
        user: { id: userId },
      } = ctx;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      if (!existingVideo.muxUploadId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video has no upload ID",
        });
      }

      const directUpload = await mux.video.uploads.retrieve(
        existingVideo.muxUploadId
      );

      if (!directUpload || !directUpload.asset_id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video upload is not completed",
        });
      }

      const asset = await mux.video.assets.retrieve(directUpload.asset_id);

      if (!asset) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to retrieve asset",
        });
      }

      const playbackId = asset.playback_ids?.[0].id;
      const duration = asset.duration ? Math.round(asset.duration * 1000) : 0;

      const [updatedVideo] = await db
        .update(videos)
        .set({
          muxPlaybackId: playbackId,
          muxStatus: asset.status,
          muxAssetId: asset.id,
          duration,
        })
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))
        .returning();

      return updatedVideo;
    }),
  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const {
        user: { id: userId },
      } = ctx;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();
        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({
            thumbnailKey: null,
            thumbnailUrl: null,
          })
          .where(and(eq(videos.id, id), eq(videos.userId, userId)));
      }

      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video has no playback ID",
        });
      }

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.png`;

      const utapi = new UTApi();
      const uploadedThumbnail = await utapi.uploadFilesFromUrl(
        tempThumbnailUrl
      );

      if (uploadedThumbnail.error || !uploadedThumbnail.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload thumbnail",
        });
      }

      const { key: thumbnailKey, ufsUrl: thumbnailUrl } =
        uploadedThumbnail.data;

      const [updatedVideo] = await db
        .update(videos)
        .set({
          thumbnailKey,
          thumbnailUrl,
        })
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))
        .returning();

      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const {
        user: { id: userId },
      } = ctx;

      const [removedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)))
        .returning();

      if (!removedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }
      return removedVideo;
    }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        user: { id: userId },
      } = ctx;

      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required",
        });
      }

      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!updatedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }
      return updatedVideo;
    }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const {
      user: { id: userId },
    } = ctx;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
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
