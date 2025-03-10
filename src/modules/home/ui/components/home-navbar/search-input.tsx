"use client";
import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WEBSITE_URL } from "@/constants";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchInput() {
  return (
    <React.Suspense fallback={<Skeleton className="w-full h-10" />}>
      <SearchInputSuspense />
    </React.Suspense>
  );
}

function SearchInputSuspense() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const [value, setValue] = useState(query);
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const url = new URL("/search", WEBSITE_URL);
    const newQuery = value.trim();

    url.searchParams.set("query", encodeURIComponent(newQuery));

    if (categoryId) {
      url.searchParams.set("categoryId", categoryId);
    }

    if (newQuery === "") {
      url.searchParams.delete("query");
    }

    setValue(newQuery);
    router.push(url.toString());
  }
  return (
    <form
      className="flex w-full items-center max-w-[600px]"
      onSubmit={handleSearch}
    >
      <div className="relative w-full">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-full pl-4 pr-12 py-2 border border-gray-200 rounded-l-full focus:outline-hidden  focus:ring-2 focus:ring-primary"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          >
            <XIcon className="text-gray-500" />
          </Button>
        )}
      </div>
      <Button
        type="submit"
        variant="searchIcon"
        className="h-11"
        disabled={!value.trim()}
      >
        <SearchIcon className="size-6" />
      </Button>
    </form>
  );
}
