'use client';

import { useRef, useEffect } from 'react';

export function CompanyMarquee({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animId = 0;
    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;

    // 自動スクロール
    function step() {
      if (!isPaused && !isDragging) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    }
    animId = requestAnimationFrame(step);

    // マウスドラッグ（window全体で捕捉）
    function onMouseEnter() { isPaused = true; }
    function onMouseLeave() { if (!isDragging) isPaused = false; }

    function onMouseDown(e: MouseEvent) {
      isDragging = true;
      isPaused = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.style.cursor = 'grabbing';
      e.preventDefault();
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      el.scrollLeft = startScroll + (startX - e.clientX);
    }

    function onMouseUp() {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = '';
      // マウスがまだ要素上にいる場合はホバー状態維持
      const rect = el.getBoundingClientRect();
      const overEl = document.elementFromPoint(rect.left + 1, rect.top + 1) === el
        || el.contains(document.elementFromPoint(rect.left + 1, rect.top + 1));
      if (!overEl) isPaused = false;
    }

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mousedown', onMouseDown);
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
