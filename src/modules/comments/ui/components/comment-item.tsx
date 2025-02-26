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
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TrashIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentReplies } from "./comment-replies";

interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
  variant?: "comment" | "reply";
}

export function CommentItem({
  comment,
  variant = "comment",
}: CommentItemProps) {
  const { userId } = useAuth();
  const clerk = useClerk();

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

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

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong");

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn({ redirectUrl: `/videos/${comment.videoId}` });
      }
    },
  });

  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong");

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
            size={variant === "comment" ? "lg" : "sm"}
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
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Button
                disabled={like.isPending || dislike.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => like.mutate({ commentId: comment.id })}
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction === "like" && "fill-black"
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.likesCount}
              </span>
              <Button
                disabled={dislike.isPending || like.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => dislike.mutate({ commentId: comment.id })}
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction === "dislike" && "fill-black"
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.dislikesCount}
              </span>
            </div>
            {variant === "comment" && (
              <Button
                variant="ghost"
                size="default"
                onClick={() => setIsReplyOpen(true)}
              >
                Reply
              </Button>
            )}
          </div>
        </div>
        {isOwner && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="size-8">
                <MoreVerticalIcon className="text-muted-foreground size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {variant === "comment" && (
                <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
                  <MessageSquareIcon className="size-4" />
                  Reply
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => removeComment({ id: comment.id })}
              >
                <TrashIcon className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isReplyOpen && variant === "comment" && (
        <div className="mt-2 pl-14">
          <CommentForm
            videoId={comment.videoId}
            parentId={comment.id}
            variant="reply"
            onCancel={() => setIsReplyOpen(false)}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
          />
        </div>
      )}
      {comment.repliesCount > 0 && variant === "comment" && (
        <div className="mt-2 pl-14">
          <Button
            variant="tertiary"
            size="default"
            onClick={() => setIsRepliesOpen((prev) => !prev)}
          >
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {comment.repliesCount} replies
          </Button>
        </div>
      )}
      {comment.repliesCount > 0 && variant === "comment" && isRepliesOpen && (
        <div className="mt-2 pl-14">
          <CommentReplies videoId={comment.videoId} parentId={comment.id} />
        </div>
      )}
    </div>
  );
}
