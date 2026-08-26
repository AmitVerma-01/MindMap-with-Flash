import { cn } from "@/lib/cn";

interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function PageHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 md:mb-12 animate-fade-in",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <div className={cn("inline-block mb-4", align === "center" && "mx-auto")}>
          <div className="glass-card px-4 py-1.5 md:px-6 md:py-2 rounded-full">
            <span className="text-xs md:text-sm font-bold text-primary tracking-wider">
              {badge}
            </span>
          </div>
        </div>
      )}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 md:mb-3 drop-shadow-lg">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
