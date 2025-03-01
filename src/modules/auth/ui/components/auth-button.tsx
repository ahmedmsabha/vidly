import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { ClapperboardIcon, UserIcon, UserCircleIcon } from "lucide-react";
export function AuthButton() {
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              href="/users/current"
              label="My Profile"
              labelIcon={<UserIcon className="size-4" />}
            />
            <UserButton.Link
              href="/studio"
              label="Studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
            />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className={`px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500
       border-blue-500/20 rounded-full shadow-none`}
          >
            <UserCircleIcon />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
