'use client';

import { useRef, useEffect } from 'react';

export function CompanyMarquee({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;

    let animId = 0;
    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;

    function step() {
      if (!isPaused && !isDragging) {
        node.scrollLeft += 0.6;
        if (node.scrollLeft >= node.scrollWidth / 2) {
          node.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    }
    animId = requestAnimationFrame(step);

    function onMouseEnter() { isPaused = true; }
    function onMouseLeave() { if (!isDragging) isPaused = false; }

    function onMouseDown(e: MouseEvent) {
      isDragging = true;
      isPaused = true;
      startX = e.clientX;
      startScroll = node.scrollLeft;
      node.style.cursor = 'grabbing';
      e.preventDefault();
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      node.scrollLeft = startScroll + (startX - e.clientX);
    }

    function onMouseUp() {
      if (!isDragging) return;
      isDragging = false;
      node.style.cursor = '';
      const rect = node.getBoundingClientRect();
      const over = node.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));
      if (!over) isPaused = false;
    }

    node.addEventListener('mouseenter', onMouseEnter);
    node.addEventListener('mouseleave', onMouseLeave);
    node.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      node.removeEventListener('mouseenter', onMouseEnter);
      node.removeEventListener('mouseleave', onMouseLeave);
      node.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="overflow-x-auto pb-3 select-none cursor-grab"
      style={{ scrollbarWidth: 'none' } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
