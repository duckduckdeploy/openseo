import { ArrowRight } from 'lucide-react';
import { SIGN_UP_URL } from '@/lib/site';
import { ButtonLink } from './button';

interface CtaBandProps {
  title?: string;
  body?: string;
}

/** Contained accent panel that closes most pages. */
export function CtaBand({
  title = 'Your SEO, on your terms.',
  body = 'Start online in a minute, or run the whole suite on your own server. It is open source either way.',
}: CtaBandProps) {
  return (
    <section aria-labelledby="cta-title" className="container-page py-20 md:py-28">
      <div className="relative isolate overflow-hidden rounded-xl bg-[linear-gradient(135deg,#1b3fc2_0%,#2350e6_45%,#3a5ff0_100%)] px-6 py-16 text-center text-white shadow-hard-lg sm:px-12 md:py-24">
        {/* Peach-to-orange light in the corners, away from the text; a fine hatch over the blue. */}
        <div className="pointer-events-none absolute -right-24 -bottom-32 -z-10 size-[30rem] rounded-full bg-[radial-gradient(closest-side,#f6a26a,rgb(248_207_174/0.55)_45%,transparent)] opacity-90" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-40 -left-24 -z-10 size-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.22),transparent)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.06)_0_1px,transparent_1px_10px)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl">
          <h2 id="cta-title" className="text-title text-balance">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-white/90">{body}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={SIGN_UP_URL} variant="inverse" size="lg">
              Get started
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href="/docs/self-hosting"
              size="lg"
              className="!border-white/50 !bg-white/5 !text-white !shadow-none backdrop-blur hover:!border-white hover:!bg-white/15"
            >
              Self-host it
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
