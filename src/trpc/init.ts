import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { rateLimit, mutationRateLimit } from "@/lib/ratelimit";
export const createTRPCContext = cache(async () => {
  const { userId } = await auth();

  return { clerkUserId: userId };
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, ctx.clerkUserId))
    .limit(1);

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const { success } = await rateLimit.limit(user.id);

  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }
  return next({ ctx: { ...ctx, user } });
});

// Separate procedure for mutations with stricter rate limiting
export const protectedMutationProcedure = t.procedure.use(
  async ({ ctx, next }) => {
    if (!ctx.clerkUserId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, ctx.clerkUserId))
      .limit(1);

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const { success } = await mutationRateLimit.limit(user.id);

    if (!success) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }
    return next({ ctx: { ...ctx, user } });
  }
);
