"use client";
import { SidebarContent } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import React from "react";
import { MainSection } from "./main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "./personal-section";
import { SubscriptionsSection } from "./subscriptions-section";
import { SignedIn } from "@clerk/nextjs";

export function HomeSidebar() {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator />
        <PersonalSection />
        <SignedIn>
          <>
            <Separator />
            <SubscriptionsSection />
          </>
        </SignedIn>
      </SidebarContent>
    </Sidebar>
  );
}
