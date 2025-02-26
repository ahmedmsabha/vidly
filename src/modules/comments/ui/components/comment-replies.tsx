import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { CornerDownRightIcon, Loader2Icon } from "lucide-react";
import { CommentItem } from "./comment-item";
import { Button } from "@/components/ui/button";
interface CommentRepliesProps {
  videoId: string;
  parentId: string;
}

export function CommentReplies({ videoId, parentId }: CommentRepliesProps) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        videoId,
        parentId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <div className="pl-14">
      <div className="flex flex-col gap-4 mt-2">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2Icon className="size-6 text-muted-foreground animate-spin" />
          </div>
        )}
        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} variant="reply" />
            ))}
      </div>
      {hasNextPage && (
        <div className="flex items-center justify-start">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="tertiary"
          >
            <CornerDownRightIcon />
            Show more replies
          </Button>
        </div>
      )}
    </div>
  );
}
