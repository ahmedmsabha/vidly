"use client";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { ResponsizeDialog } from "@/components/responsize-dialog";
import { StudioUploader } from "./studio-uploader";
import { useRouter } from "next/navigation";
export function StudioUploadModel() {
  const utils = trpc.useUtils();
  const router = useRouter();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video created");
      utils.studio.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUploadSuccess = () => {
    if (!create.data?.video.id) {
      toast.error("Failed to create video");
      return;
    }

    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };

  return (
    <>
      <ResponsizeDialog
        title="Upload a Video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader
            endpoint={create.data.url}
            onSuccess={handleUploadSuccess}
          />
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
