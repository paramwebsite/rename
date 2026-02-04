import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { digitImages } from "./digitImages";

export function SlotDigit({ trigger, finalDigit }) {
  const reelRef = useRef(null);
  const viewRef = useRef(null);
  const [digitHeight, setDigitHeight] = useState(0);

  // Measure the visible window height (responsive)
  useLayoutEffect(() => {
    const el = viewRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;
      setDigitHeight(h);
    });

    ro.observe(el);
    // initial
    setDigitHeight(el.getBoundingClientRect().height);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel || !digitHeight) return;

    const target = Number(finalDigit);

    // Full cycles before stopping
    const cycles = 2;
    const totalDigits = cycles * 10 + target;

    const translateY = totalDigits * digitHeight;

    // Reset instantly
    reel.style.transition = "none";
    reel.style.transform = "translateY(0px)";

    // Force layout
    reel.getBoundingClientRect();

    // Animate upward
    reel.style.transition = "transform 1.4s cubic-bezier(0.15, 0.85, 0.25, 1)";
    reel.style.transform = `translateY(-${translateY}px)`;
  }, [trigger, finalDigit, digitHeight]);

  return (
    <div ref={viewRef} className="relative h-full w-full overflow-hidden">
      <div ref={reelRef} className="absolute left-0 top-0 w-full">
        {Array.from({ length: 4 }).map((_, cycle) =>
          digitImages.map((src, i) => (
            <img
              key={`${cycle}-${i}`}
              src={src}
              alt={String(i)}
              className="block w-full object-contain"
              style={{ height: `${digitHeight || 1}px` }} // each digit = viewport height
              draggable={false}
            />
          ))
        )}
      </div>
    </div>
  );
}
