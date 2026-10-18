import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { TourStop } from '@/content/tour';
import { inSentence } from '@/lib/site';
import { Band, type Tone } from './band';
import { Screenshot } from './screenshot';
import { ShotSlides } from './shot-slides';

/** The screens of one tool: a single framed screenshot, or slides through its parts. */
export function TourShots({ stop, priority, glow = false }: { stop: TourStop; priority?: boolean; glow?: boolean }) {
  const [first] = stop.slides;
  if (stop.slides.length === 1 && first) return <Screenshot name={first.name} alt={first.alt} window glow={glow} priority={priority} />;
  return <ShotSlides slides={stop.slides} label={`${stop.eyebrow}, part by part`} glow={glow} />;
}

/**
 * One tool on the landing page: a two-column head (eyebrow and title on one side, what it does on the other)
 * over its screens at full width on the gradient frame, so screenshots stay large enough to read.
 * `flip` mirrors the head, so neighbouring sections do not look alike.
 */
export function TourSection({ stop, tone = 'white', flip = false }: { stop: TourStop; tone?: Tone; flip?: boolean }) {
  return (
    <Band tone={tone} labelledBy={`${stop.id}-title`}>
      <div className="grid grid-cols-1 gap-x-16 gap-y-6 lg:grid-cols-2 lg:items-end">
        <div className={flip ? 'lg:order-2' : undefined}>
          <p className="eyebrow">{stop.eyebrow}</p>
          <h2 id={`${stop.id}-title`} className="text-title mt-4">
            {stop.title}
          </h2>
        </div>
        <div className={flip ? 'lg:order-1' : undefined}>
          <p className="text-lede">{stop.lede}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
            {stop.points.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-[0.9375rem] text-ink">
                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">
                  <Check className="size-3" aria-hidden="true" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link href={stop.href} className="group mt-6 inline-flex items-center gap-1.5 font-semibold text-accent-text underline-offset-4 hover:underline">
            Learn more about {inSentence(stop.eyebrow)}
            <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="mt-12 min-w-0 md:mt-14">
        <TourShots stop={stop} glow />
      </div>
    </Band>
  );
}
