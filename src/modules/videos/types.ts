import placeholder from "@/assets/images/placeholder.svg";
import type { appRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

export const THUMBNAIL_FALLBACK = placeholder;

export type VideoGetOneOutput = inferRouterOutputs<
  typeof appRouter
>["videos"]["getOne"];

export type VideoGetManyOutput = inferRouterOutputs<
  typeof appRouter
>["suggestions"]["getMany"];
