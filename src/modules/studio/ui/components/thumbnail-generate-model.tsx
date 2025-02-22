import { ResponsizeDialog } from "@/components/responsize-dialog";
import { FormField } from "@/components/ui/form";
import { FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { z } from "zod";
interface ThumbnailGenerateModelProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10),
});
export const ThumbnailGenerateModel = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailGenerateModelProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  return (
    <ResponsizeDialog
      title="Upload thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </ResponsizeDialog>
  );
};
