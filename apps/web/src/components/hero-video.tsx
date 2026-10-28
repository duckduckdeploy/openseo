'use client';

import { useEffect, useRef } from 'react';

/**
 * The homepage tour video: muted, looping and inline, on the blue-to-orange gradient frame. Readers who
 * ask for reduced motion get the poster and the controls instead of autoplay.
 */
export function HeroVideo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      video.pause();
      video.controls = true;
      return;
    }
    // Browsers may skip the autoplay attribute after hydration; start it here too.
    video.play().catch(() => {
      video.controls = true;
    });
  }, []);

  return (
    <figure className="frame-glow">
      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-hard-lg">
        <video
          ref={ref}
          className="block aspect-video h-auto w-full"
          width={1920}
          height={1080}
          poster="/videos/openseo-tour-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={label}
        >
          <source src="/videos/openseo-tour.mp4" type="video/mp4" />
        </video>
      </div>
    </figure>
  );
}
