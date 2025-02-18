"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

export function StudioUploadModel() {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video created");
      utils.studio.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
      className="cursor-pointer"
    >
      {create.isPending ? (
        <Loader2Icon className="size-4 mr-2 animate-spin" />
      ) : (
        <PlusIcon className="size-4 mr-2" />
      )}
      {create.isPending ? "Creating..." : "Create"}
    </Button>
  );
}
