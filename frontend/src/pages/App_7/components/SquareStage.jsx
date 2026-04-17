import { useEffect, useRef, useState } from 'react';

export default function SquareStage({ children }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const minDimension = Math.min(clientWidth, clientHeight) * 0.95;
      setSize(minDimension);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center w-full h-full">
      <div 
        className="relative bg-zinc-900/50 rounded-3xl shadow-2xl overflow-hidden border border-zinc-800/50 backdrop-blur-sm"
        style={{ width: size, height: size }}
      >
        {children}
      </div>
    </div>
  );
}
