import { ResponsizeDialog } from "@/components/responsize-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

import { toast } from "sonner";
interface ThumbnailUploadModelProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModel = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModelProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ id: videoId });
    onOpenChange(false);
    toast.success("Thumbnail uploaded successfully");
  };
  return (
    <ResponsizeDialog
      title="Upload thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
        onUploadError={(error: Error) => {
          toast.error("Failed to upload thumbnail");
          console.error(error);
        }}
      />
    </ResponsizeDialog>
  );
};
