"use client";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { LogOutIcon, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { StudioSidebarHeader } from "./studio-sidebar-header";
import Link from "next/link";

export function StudioSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar className="pt-16 z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <StudioSidebarHeader />
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/studio"}
                  tooltip="Content"
                  asChild
                >
                  <Link prefetch href="/studio">
                    <VideoIcon className="size-5" />
                    <span className="text-sm">Content</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Separator />
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Exit Studio" asChild>
                  <Link prefetch href="/">
                    <LogOutIcon className="size-5" />
                    <span className="text-sm">Exit Studio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
