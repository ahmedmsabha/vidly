import { UserAvatar } from "@/components/user-avatar";
import type { CommentsGetManyOutput } from "@/modules/comments/types";
import { trpc } from "@/trpc/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
}

export function CommentItem({ comment }: CommentItemProps) {
  const { userId } = useAuth();
  const clerk = useClerk();
  const utils = trpc.useUtils();
  const isOwner = userId === comment.user.clerkId;

  const { mutate: removeComment } = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment removed");
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Failed to remove comment");

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn({ redirectUrl: `/videos/${comment.videoId}` });
      }
    },
  });

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size="lg"
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.content}</p>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon className="text-muted-foreground size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <MessageSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>
            {isOwner && (
              <DropdownMenuItem
                onClick={() => removeComment({ id: comment.id })}
              >
                <TrashIcon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
