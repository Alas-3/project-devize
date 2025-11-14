import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-blue-200 bg-blue-100 text-blue-700 [a&]:hover:bg-blue-200 [a&]:hover:shadow",
        secondary:
          "border-slate-200 bg-slate-100 text-slate-700 [a&]:hover:bg-slate-200 [a&]:hover:shadow",
        destructive:
          "border-red-200 bg-red-100 text-red-700 [a&]:hover:bg-red-200 [a&]:hover:shadow focus-visible:ring-destructive/20",
        outline:
          "border-slate-300 text-slate-700 [a&]:hover:bg-slate-50 [a&]:hover:border-slate-400 [a&]:hover:shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
