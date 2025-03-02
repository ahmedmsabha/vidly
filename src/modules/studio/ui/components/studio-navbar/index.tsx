"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { StudioUploadModel } from "../studio-upload-model";
export function StudioNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center shrink-0">
          <SidebarTrigger />
          <Link prefetch href="/studio" className="hidden md:block">
            <div className="p-4 flex items-center gap-1">
              <Image src={logo} alt="logo" width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex shrink-0 items-center gap-4">
          <StudioUploadModel />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
