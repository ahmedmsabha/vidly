import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionButtonProps {
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ButtonProps["size"];
}

export default function SubscriptionButton({
  size = "default",
  isSubscribed,
  className,
  onClick,
  disabled,
}: SubscriptionButtonProps) {
  return (
    <Button
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
      size={size}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
}
