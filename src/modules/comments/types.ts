import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type CommentsGetManyOutput =
  inferRouterOutputs<AppRouter>["comments"]["getMany"];

export type CommentsCreateInput =
  inferRouterInputs<AppRouter>["comments"]["create"];
