'use client';

import { useEffect, useRef } from 'react';

const logos = [
  { name: 'Mayora',   src: '/logo-mayora.svg'   },
  { name: 'Wismilak', src: '/logo-wismilak.svg' },
  { name: 'Wings',    src: '/logo-wings.svg'    },
  { name: 'Sinarmas', src: '/logo-sinarmas.svg' },
];

const tripled = [...logos, ...logos, ...logos];

export default function ClientsSection() {
  const trackRef  = useRef(null);
  const animRef   = useRef(null);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let singleWidth = track.scrollWidth / 3;
    const onResize = () => { singleWidth = track.scrollWidth / 3; };
    window.addEventListener('resize', onResize);
    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += 0.5;
        if (posRef.current >= singleWidth) posRef.current -= singleWidth;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-[#1E8E5A] mb-2">
          Dipercaya oleh
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Perusahaan yang Telah Kami Layani
        </h2>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        <div className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10"
          style={{ background: 'linear-gradient(to right, #f9fafb, transparent)' }} />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10"
          style={{ background: 'linear-gradient(to left, #f9fafb, transparent)' }} />

        <div ref={trackRef} className="flex items-center gap-8 w-max py-4">
          {tripled.map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              style={{ width: 180, height: 100, padding: 20 }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
