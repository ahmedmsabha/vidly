import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

export function SearchInput() {
  //TODO: Add search functionality
  return (
    <form>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-4 pr-12 py-2 rounded-l-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-primary"
        />
        {/* //TODO: Add remove search button */}
      </div>
      <Button type="submit" variant="searchIcon" size="icon">
        <SearchIcon className="size-5" />
      </Button>
    </form>
  );
}
