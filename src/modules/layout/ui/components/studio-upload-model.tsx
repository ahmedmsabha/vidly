"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function StudioUploadModel() {
  return (
    <Button variant="secondary">
      <PlusIcon className="size-4 mr-2" />
      Create
    </Button>
  );
}
