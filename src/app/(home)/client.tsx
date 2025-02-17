"use client";
import React from "react";
import { trpc } from "@/trpc/client";

export default function PageClient() {
  const [data] = trpc.hello.useSuspenseQuery({ text: "client" });

  return (
    <div>
      <h1>Client</h1>
      <p>{data.greeting}</p>
    </div>
  );
}
