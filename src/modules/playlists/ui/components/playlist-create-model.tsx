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
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
interface PlaylistCreateModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});
export const PlaylistCreateModel = ({
  open,
  onOpenChange,
}: PlaylistCreateModelProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const utils = trpc.useUtils();
  const createPlaylist = trpc.playlists.create.useMutation({
    onSuccess: () => {
      toast.success("Playlist created");
      form.reset();
      onOpenChange(false);
      utils.playlists.getMany.invalidate();
    },
    onError: () => {
      toast.error("Failed to create playlist");
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    createPlaylist.mutate(data);
  }

  return (
    <ResponsizeDialog
      title="Create a playlist"
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My favorite videos" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={createPlaylist.isPending}>
              {createPlaylist.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsizeDialog>
  );
};
