import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-slate-400 selection:bg-blue-100 selection:text-blue-900 dark:bg-input/30 flex h-10 w-full min-w-0 rounded-md border-2 border-slate-300 px-3 py-2 text-base bg-white transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-slate-400 shadow-sm",
        "focus-visible:border-blue-500 focus-visible:ring-blue-500/20 focus-visible:ring-4 focus-visible:shadow-md",
        "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
