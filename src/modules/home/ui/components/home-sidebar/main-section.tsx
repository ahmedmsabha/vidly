import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth, useClerk } from "@clerk/nextjs";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Subscriptions",
    href: "/feed/subscriptions",
    icon: PlaySquareIcon,
    auth: true,
  },
  {
    title: "Trending",
    href: "/feed/trending",
    icon: FlameIcon,
  },
];

export function MainSection() {
  const pathname = usePathname();
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  const isActive = (path: string) => pathname === path;
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} {...item}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={isActive(item.href)}
                onClick={(e) => {
                  if (item.auth && !isSignedIn) {
                    e.preventDefault();
                    return clerk.openSignIn({ redirectUrl: item.href });
                  }
                }}
              >
                <Link href={item.href} className="flex items-center gap-4">
                  <item.icon />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
