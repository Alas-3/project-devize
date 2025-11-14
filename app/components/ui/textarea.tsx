import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-red-500 dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-base transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-slate-400 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
