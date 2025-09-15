import * as React from "react";
import { cn } from "../utils/utils";


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium cursor-default select-none",
        variant === "default" && "bg-blue-600 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
