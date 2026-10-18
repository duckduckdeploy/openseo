import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { creditExamples } from '@/content/pricing';
import { YEPAPI_URL } from '@/lib/site';
import { ButtonLink } from './button';

const steps = [
  { title: 'Sign up at YepAPI', body: 'New accounts get $5 in free credit, for a limited time.' },
  { title: 'Copy your API key', body: 'It is on your YepAPI dashboard once you sign in.' },
  { title: 'Paste it into OpenSEO', body: 'During account setup, or later in Settings. Every tool works from there.' },
];

interface YepapiOfferProps {
  /** Show what $5 covers (on the pricing page). */
  examples?: boolean;
  /** The band it sits in; pick one that differs from its neighbours. */
  tone?: 'white' | 'cream' | 'peach';
}

/**
 * The one place a page talks about the data provider: a plain, no-sales-talk note on how to get search data,
 * with YepAPI's limited-time $5 sign-up credit. Use it once, only on pages about the tools or setup.
 */
export function YepapiOffer({ examples = false, tone = 'white' }: YepapiOfferProps) {
  return (
    <section id="free-credit" aria-labelledby="credit-title" className={`band-${tone} scroll-mt-20 border-y border-line`}>
      <div className="container-page py-20 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Search data</p>
          <h2 id="credit-title" className="text-title mt-4">
            Start with $5 of free search data
          </h2>
          <p className="text-lede mx-auto mt-5">
            Keyword, ranking and backlink data in OpenSEO comes from YepAPI. Sign up there and new accounts get $5 in free
            credit, for a limited time. That is enough to try every tool before you spend anything.
          </p>
        </div>

        <ol className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="card card-peach p-6">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-orange font-display text-base font-bold text-night">{index + 1}</span>
              <p className="mt-4 font-semibold">{step.title}</p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        {examples ? (
          <div className="mx-auto mt-12 max-w-4xl">
            <h3 className="text-heading text-center">What $5 of free credit covers</h3>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {creditExamples.map((example) => (
                <li key={example.what} className="card-night card p-6 text-center">
                  <p className="figure text-[#ff8a3d]">{example.amount.replace('about ', '≈ ')}</p>
                  <p className="mt-3 font-medium text-[#f7f0e7]">{example.what}</p>
                  <p className="mt-1 text-sm text-[#c6b9ab]">{example.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-center text-sm text-muted">Each figure is an alternative, not a bundle. The app shows every price before it runs.</p>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={YEPAPI_URL} size="lg">
            Sign up at YepAPI
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/docs/getting-started" variant="secondary" size="lg">
            Setup guide
          </ButtonLink>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-faint">
          The free credit is YepAPI’s limited-time offer and may end. After it, you pay YepAPI per lookup, at the price OpenSEO
          shows before each one runs.{' '}
          {examples ? null : (
            <Link href="/pricing" className="underline underline-offset-4 hover:text-ink">
              See pricing
            </Link>
          )}
        </p>
      </div>
    </section>
  );
}
