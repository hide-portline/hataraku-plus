'use client';

import { useRef, useEffect } from 'react';

export function CompanyMarquee({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function step() {
      if (el && !isPaused.current) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animRef.current = requestAnimationFrame(step);
    }
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      ref={ref}
      className="overflow-x-auto pb-3 select-none"
      style={{ scrollbarWidth: 'none' } as React.CSSProperties}
      onPointerEnter={() => { isPaused.current = true; }}
      onPointerLeave={() => {
        isPaused.current = false;
        isDragging.current = false;
      }}
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') return;
        if (!ref.current) return;
        isDragging.current = true;
        isPaused.current = true;
        startX.current = e.clientX;
        startScroll.current = ref.current.scrollLeft;
        ref.current.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!isDragging.current || !ref.current) return;
        const dx = startX.current - e.clientX;
        ref.current.scrollLeft = startScroll.current + dx;
      }}
      onPointerUp={() => {
        isDragging.current = false;
      }}
    >
      {children}
    </div>
  );
}
