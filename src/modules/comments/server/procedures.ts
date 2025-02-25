import { z } from "zod";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { comments, users } from "@/db/schema";
import { db } from "@/db";
import { eq, getTableColumns, desc, or, lt, and, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const commentsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { id: userId } = ctx.user;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.userId, userId)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }
      return deletedComment;
    }),
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId, content } = input;
      const { id: userId } = ctx.user;

      const [createdComment] = await db
        .insert(comments)
        .values({ userId, videoId, content })
        .returning();

      return createdComment;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
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
      const { videoId, cursor, limit } = input;

      const [totalData, commentsList] = await Promise.all([
        db
          .select({
            count: count(),
          })
          .from(comments)
          .where(eq(comments.videoId, videoId)),
        await db
          .select({
            ...getTableColumns(comments),
            user: users,
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .innerJoin(users, eq(comments.userId, users.id))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),
      ]);

      const hasMore = commentsList.length > limit;
      const items = hasMore ? commentsList.slice(0, -1) : commentsList;

      const lastItem = items[items.length - 1];

      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        totalCount: totalData[0].count,
        items,
        nextCursor,
      };
    }),
});
