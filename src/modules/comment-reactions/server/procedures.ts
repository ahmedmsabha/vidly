import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { commentReactions } from "@/db/schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";

export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;

      const [existingReactionLike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.type, "like")
          )
        );

      if (existingReactionLike) {
        const [deletedCommentReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();

        return deletedCommentReaction;
      }

      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({ userId, commentId, type: "like" })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: "like",
          },
        })
        .returning();

      return createdCommentReaction;
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;

      const [existingReactionDislike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.type, "dislike")
          )
        );

      if (existingReactionDislike) {
        const [deletedCommentReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();

        return deletedCommentReaction;
      }

      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({ userId, commentId, type: "dislike" })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: "dislike",
          },
        })
        .returning();

      return createdCommentReaction;
    }),
});
