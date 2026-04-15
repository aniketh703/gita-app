import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Platform, Pressable } from "react-native";

const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2 rounded-2xl shadow-none",
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-gita-accent dark:bg-gita-dark-accent active:opacity-90 shadow-sm shadow-black/5",
          Platform.select({ web: "hover:opacity-90" }),
        ),
        destructive: cn(
          "bg-destructive active:bg-destructive/90 dark:bg-destructive/60 shadow-sm shadow-black/5",
          Platform.select({
            web: "hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          }),
        ),
        outline: cn(
          "border-gita-border bg-gita-bg dark:bg-gita-dark-section dark:border-gita-dark-border active:bg-gita-section dark:active:bg-gita-dark-section border shadow-sm shadow-black/5",
          Platform.select({
            web: "hover:bg-gita-section dark:hover:bg-gita-dark-section",
          }),
        ),
        secondary: cn(
          "bg-gita-section dark:bg-gita-dark-section active:opacity-90 shadow-sm shadow-black/5",
          Platform.select({ web: "hover:opacity-90" }),
        ),
        ghost: cn(
          "active:bg-gita-section dark:active:bg-gita-dark-section",
          Platform.select({
            web: "hover:bg-gita-section dark:hover:bg-gita-dark-section",
          }),
        ),
        link: "",
      },
      size: {
        default: cn(
          "h-12 px-6 py-3 sm:h-11",
          Platform.select({ web: "has-[>svg]:px-4" }),
        ),
        sm: cn(
          "h-10 gap-1.5 rounded-xl px-4 sm:h-9",
          Platform.select({ web: "has-[>svg]:px-3" }),
        ),
        lg: cn(
          "h-14 rounded-2xl px-7 sm:h-12",
          Platform.select({ web: "has-[>svg]:px-5" }),
        ),
        icon: "h-10 w-10 sm:h-9 sm:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  cn(
    "text-gita-text dark:text-gita-dark-text text-sm font-medium",
    Platform.select({ web: "pointer-events-none transition-colors" }),
  ),
  {
    variants: {
      variant: {
        default: "text-white",
        destructive: "text-white",
        outline: cn(
          "group-active:text-gita-text dark:group-active:text-gita-dark-text",
          Platform.select({
            web: "group-hover:text-gita-text dark:group-hover:text-gita-dark-text",
          }),
        ),
        secondary: "text-gita-text dark:text-gita-dark-text",
        ghost:
          "group-active:text-gita-text dark:group-active:text-gita-dark-text",
        link: cn(
          "text-gita-accent dark:text-gita-dark-accent group-active:underline",
          Platform.select({
            web: "underline-offset-4 hover:underline group-hover:underline",
          }),
        ),
      },
      size: {
        default: "",
        sm: "",
        lg: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          props.disabled && "opacity-50",
          buttonVariants({ variant, size }),
          className,
        )}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };

