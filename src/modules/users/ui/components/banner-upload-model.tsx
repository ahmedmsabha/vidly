import { ResponsizeDialog } from "@/components/responsize-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

import { toast } from "sonner";
interface BannerUploadModelProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BannerUploadModel = ({
  userId,
  open,
  onOpenChange,
}: BannerUploadModelProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.users.getOne.invalidate({ id: userId });
    onOpenChange(false);
    toast.success("Banner uploaded successfully");
  };
  return (
    <ResponsizeDialog
      title="Upload banner"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="bannerUploader"
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsizeDialog>
  );
};
