type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[var(--color-border)] shadow-sm ${hover ? "hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
