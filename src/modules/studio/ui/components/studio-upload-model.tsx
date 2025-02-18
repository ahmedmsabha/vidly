"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { ResponsizeDialog } from "@/components/responsize-dialog";
import { StudioUploader } from "./studio-uploader";

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
    <>
      <ResponsizeDialog
        title="Upload a Video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={() => {}} />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsizeDialog>
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
    </>
  );
}
