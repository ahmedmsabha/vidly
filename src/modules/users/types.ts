import placeholder from "@/assets/images/placeholder.svg";
import type { appRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

export const THUMBNAIL_FALLBACK = placeholder;

export type UserGetOneOutput = inferRouterOutputs<
  typeof appRouter
>["users"]["getOne"];
