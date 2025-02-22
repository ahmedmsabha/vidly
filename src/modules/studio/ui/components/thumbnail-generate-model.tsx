import { ResponsizeDialog } from "@/components/responsize-dialog";
import { FormField } from "@/components/ui/form";
import {
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      toast.success("Background job started", {
        description: "This may take some time to complete",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to generate thumbnail");
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    generateThumbnail.mutate({
      prompt: data.prompt,
      id: videoId,
    });
  }

  return (
    <ResponsizeDialog
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none"
                    cols={30}
                    rows={5}
                    placeholder="A description of wanted thumbnail"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={generateThumbnail.isPending}>
              {form.formState.isSubmitting ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsizeDialog>
  );
};
