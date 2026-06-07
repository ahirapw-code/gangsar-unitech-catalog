'use client';

import { useEffect, useRef } from 'react';

const logos = [
  { name: 'Mayora',    src: '/logo-mayora.png',   blend: true },
  { name: 'Wismilak',  src: '/logo-wismilak.png', blend: true },
  { name: 'Wings',     src: '/logo-wings.svg',    blend: false },
  { name: 'Sinarmas',  src: '/logo-sinarmas.png', blend: true },
];

const tripled = [...logos, ...logos, ...logos];

export default function ClientsSection() {
  const trackRef = useRef(null);
  const animRef  = useRef(null);
  const posRef   = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let singleWidth = track.scrollWidth / 3;
    const onResize = () => { singleWidth = track.scrollWidth / 3; };
    window.addEventListener('resize', onResize);

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += 0.6;
        if (posRef.current >= singleWidth) posRef.current -= singleWidth;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden">
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
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
          style={{ background: 'linear-gradient(to right, #fff, transparent)' }} />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
          style={{ background: 'linear-gradient(to left, #fff, transparent)' }} />

        <div ref={trackRef} className="flex items-center gap-8 w-max py-2">
          {tripled.map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-44 h-24 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center p-4 hover:shadow-md hover:border-[#1E8E5A]/40 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={logo.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  mixBlendMode: logo.blend ? 'multiply' : 'normal',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
