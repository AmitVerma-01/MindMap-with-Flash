import { ButtonHTMLAttributes, forwardRef, isValidElement, cloneElement, type ReactElement } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-gradient text-white border border-primary/30 hover:brightness-110 shadow-sm",
  secondary: "glass-button text-foreground",
  ghost: "bg-transparent text-foreground hover:bg-surface border border-border",
  danger:
    "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      disabled,
      asChild,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<{ className?: string; ref?: React.Ref<unknown> }>, {
        className: cn(classes, (children as ReactElement<{ className?: string }>).props.className),
        ref,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
