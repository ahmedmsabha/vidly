import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

export function SearchInput() {
  //TODO: Add search functionality
  return (
    <form className="flex w-full items-center max-w-[600px]">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-4 pr-12 py-2 border border-gray-200 rounded-l-full focus:outline-hidden  focus:ring-2 focus:ring-primary"
        />
        {/* //TODO: Add remove search button */}
      </div>
      <Button type="submit" variant="searchIcon" className="h-11">
        <SearchIcon className="size-6" />
      </Button>
    </form>
  );
}
