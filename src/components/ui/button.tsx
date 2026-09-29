import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-ring disabled:opacity-50 disabled:pointer-events-none select-none rounded-md";

    const variantStyles = {
      primary:
        "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 shadow-sm",
      secondary:
        "bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--border)] border border-[var(--border)]",
      outline:
        "border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] bg-transparent",
      ghost:
        "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] bg-transparent",
      danger:
        "bg-[var(--status-error)] text-white hover:opacity-90 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-8 px-2.5 text-xs gap-1.5",
      md: "h-9 px-3.5 text-sm gap-2",
      lg: "h-10 px-5 text-sm gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
