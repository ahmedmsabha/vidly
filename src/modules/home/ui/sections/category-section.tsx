"use client";
import { trpc } from "@/trpc/client";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import {
  FilterCarousel,
  CategoriesLoadingSkeleton,
} from "@/components/filter.carousel";
import { useRouter } from "next/navigation";

export function CategorySection({ categoryId }: { categoryId?: string }) {
  return (
    <Suspense fallback={<CategoriesLoadingSkeleton />}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <CategorySectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function CategorySectionSuspense({ categoryId }: { categoryId?: string }) {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const router = useRouter();

  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  function onSelect(value: string | null) {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.toString());
  }
  return <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />;
}
