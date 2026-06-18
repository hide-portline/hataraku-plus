export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const scale = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-xl";

  return (
    <div className="flex flex-col items-center leading-none select-none">
      <div className={`${scale} font-extrabold tracking-tight flex items-baseline gap-0.5`}>
        <span style={{ color: "#2D3A4B" }}>Hataraku</span>
        <span style={{ color: "#E8792A" }}>+</span>
      </div>
      <div className="w-full h-px my-0.5" style={{ backgroundColor: "#2D3A4B", opacity: 0.3 }} />
      <div className="text-[0.6em] font-semibold tracking-[0.2em]" style={{ color: "#2D3A4B" }}>
        淡路島
      </div>
    </div>
  );
}
