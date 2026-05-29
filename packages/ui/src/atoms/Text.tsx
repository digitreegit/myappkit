import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const text = cva("", {
  variants: {
    variant: {
      h1: "text-3xl font-bold tracking-tight text-foreground",
      h2: "text-2xl font-semibold tracking-tight text-foreground",
      h3: "text-xl font-semibold text-foreground",
      body: "text-base text-foreground",
      caption: "text-sm text-muted",
    },
  },
  defaultVariants: { variant: "body" },
});

type Element = "h1" | "h2" | "h3" | "p" | "span";

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof text> {
  as?: Element;
}

export function Text({ as, variant, className, children, ...props }: TextProps) {
  const Tag = (as ?? (variant?.startsWith("h") ? (variant as Element) : "p")) as Element;
  return (
    <Tag className={cn(text({ variant }), className)} {...props}>
      {children}
    </Tag>
  );
}
