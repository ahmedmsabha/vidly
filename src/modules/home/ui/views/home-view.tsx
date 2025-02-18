import React from "react";
import { CategorySection } from "../sections/category-section";

export function HomeView({ categoryId }: { categoryId?: string }) {
  return (
    <div className="max-w-[2000px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-6">
      <CategorySection categoryId={categoryId} />
    </div>
  );
}
