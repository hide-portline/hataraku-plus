'use client';

import { useRef, useEffect } from 'react';

export function CompanyMarquee({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const animFrame = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const speed = 0.6;

    function step() {
      if (el && !isPaused.current) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animFrame.current = requestAnimationFrame(step);
    }

    animFrame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  return (
    <div
      ref={ref}
      className="overflow-x-auto pb-3 cursor-grab active:cursor-grabbing select-none [-webkit-overflow-scrolling:touch]"
      style={{ scrollbarWidth: 'none' }}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; isDown.current = false; }}
      onMouseDown={(e) => {
        isDown.current = true;
        startX.current = e.pageX;
        startScrollLeft.current = ref.current?.scrollLeft ?? 0;
      }}
      onMouseMove={(e) => {
        if (!isDown.current || !ref.current) return;
        e.preventDefault();
        const walk = (e.pageX - startX.current) * 1.5;
        ref.current.scrollLeft = startScrollLeft.current - walk;
      }}
      onMouseUp={() => { isDown.current = false; }}
    >
      {children}
    </div>
  );
}
