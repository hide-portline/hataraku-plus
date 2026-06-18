type Variant = "brand" | "accent" | "neutral" | "success" | "warning" | "error";

type BadgeProps = {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  brand: "bg-[var(--color-brand)]/10 text-[var(--color-brand)]",
  accent: "bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)]",
  neutral: "bg-[var(--color-border)] text-[var(--color-text-secondary)]",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
};

export default function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
