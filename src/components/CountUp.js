'use client';
import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, duration = 2000, startOnMount = true) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnMount) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, startOnMount, started]);

  return { value, ref };
}

export default function CountUpStat({ target, prefix = '', suffix = '', label, className = '' }) {
  const { value, ref } = useCountUp(target);

  return (
    <div ref={ref} style={{ textAlign: 'center' }} className={className}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
        {prefix}{value.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
        {label}
      </div>
    </div>
  );
}
