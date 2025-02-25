import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { subscriptions } from "@/db/schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const subscriptionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const { id: viewerId } = ctx.user;

      if (viewerId === userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot subscribe to yourself",
        });
      }

      const [createdSubscription] = await db
        .insert(subscriptions)
        .values({
          viewerId,
          creatorId: userId,
        })
        .returning();

      console.log("createdSubscription", createdSubscription);
      return createdSubscription;
    }),
  remove: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const { id: viewerId } = ctx.user;

      if (viewerId === userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot unsubscribe from yourself",
        });
      }

      const [deletedSubscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.viewerId, viewerId),
            eq(subscriptions.creatorId, userId)
          )
        )
        .returning();

      return deletedSubscription;
    }),
});
