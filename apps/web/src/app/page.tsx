import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, Check, Code2, Server, ShieldCheck } from 'lucide-react';
import { AgentFold } from '@/components/agent-fold';
import { Band, type Tone } from '@/components/band';
import { BrandIcon } from '@/components/brand-icon';
import { ButtonLink } from '@/components/button';
import { CodeBlock } from '@/components/code-block';
import { CtaBand } from '@/components/cta-band';
import { FeatureGrid } from '@/components/feature-grid';
import { JsonLd } from '@/components/json-ld';
import { Screenshot } from '@/components/screenshot';
import { SectionHeader } from '@/components/section';
import { TourSection } from '@/components/tour-section';
import { YepapiOffer } from '@/components/yepapi-offer';
import { AUDIT_CHECKS } from '@/content/features';
import { selfHostDocker } from '@/content/snippets';
import { tour } from '@/content/tour';
import { pageMeta } from '@/lib/metadata';
import { GITHUB_URL, SIGN_UP_URL, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';

export const metadata = pageMeta({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: '/',
  absoluteTitle: true,
});

const ledger = [
  { value: 'MIT', label: 'Open-source licence' },
  { value: '1', label: 'Docker command to self-host' },
  { value: '76', label: 'MCP tools for your AI agent' },
  { value: String(AUDIT_CHECKS), label: 'Site audit checks, free' },
];

const control = [
  {
    icon: Code2,
    title: 'Open source, all of it',
    body: 'The app, the API, the crawler and the agent server are MIT licensed. Read every line, change what you need, and keep your changes.',
  },
  {
    icon: Server,
    title: 'Your server, your data',
    body: 'Run it on your own computer or server with Docker. Your keywords, rankings and audits live in your own database, and you decide what leaves it.',
  },
  {
    icon: ShieldCheck,
    title: 'No surprise bills',
    body: 'Pay per lookup, with every call and its cost listed in the app. Set a monthly limit and nothing is spent past it, by you or by any agent.',
  },
  {
    icon: Bot,
    title: 'Agents on a leash',
    body: '76 MCP tools give your agent the whole workspace, and every paid call takes a ceiling: a call that could cost more than you agreed is refused before it starts.',
  },
];

const selfHostPoints = [
  'One image and one compose file: database, API, dashboard and site',
  'Any machine that runs Docker: your PC, a home server or a $10 cloud server',
  'Automatic HTTPS for your own domain',
];

/** Tour stops alternate tone and side, so no two neighbouring sections look alike. */
const TOUR_TONES: Tone[] = ['white', 'cream', 'peach'];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web, Linux, Windows, macOS (Docker)',
          license: 'https://opensource.org/license/mit',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      {/* Hero: cream with a blue and peach glow, the product on its gradient frame */}
      <section aria-labelledby="hero-title" className="band-cream relative overflow-hidden">
        <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="hatch pointer-events-none absolute -top-24 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 opacity-60" aria-hidden="true" />
        <div className="container-page relative pt-16 pb-20 md:pt-24 md:pb-24 xl:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-peach-strong bg-surface/80 px-4 py-1.5 text-sm font-medium text-ink shadow-hard-sm backdrop-blur">
              <span className="size-2 rounded-full bg-orange" aria-hidden="true" />
              Open source · MIT licence · Self-hostable
            </p>

            <h1 id="hero-title" className="text-display animate-rise mt-8 text-balance [animation-delay:60ms]">
              <span className="mark">Open&#8209;source</span> SEO Ahrefs &amp; SEMrush features
            </h1>

            <p className="text-lede animate-rise mx-auto mt-7 max-w-2xl [animation-delay:120ms]">
              Keyword research, rank tracking, backlinks, site audits, AI visibility and your Search Console data, in one
              workspace you can run yourself, read every line of, and hand to your AI agent.
            </p>

            <div className="animate-rise mt-10 flex flex-col justify-center gap-3 [animation-delay:180ms] sm:flex-row">
              <ButtonLink href={SIGN_UP_URL} size="lg">
                Get started
                <ArrowRight className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/docs/self-hosting" variant="secondary" size="lg">
                <BrandIcon brand="docker" className="size-5" />
                Self-host with Docker
              </ButtonLink>
            </div>

            <p className="animate-rise mt-6 text-[0.9375rem] text-muted [animation-delay:240ms]">
              Or{' '}
              <Link href="/tools" className="font-semibold text-accent-text underline-offset-4 hover:underline">
                see every SEO tool
              </Link>
              , with real screenshots.
            </p>
          </div>

          <div className="animate-rise mx-auto mt-14 max-w-6xl [animation-delay:200ms] md:mt-16">
            <Screenshot
              name="keyword-overview"
              window
              glow
              label="app.openseo.gg/tools/keyword-overview?q=standing+desk&country=us"
              priority
              alt="The Keyword overview for standing desk: difficulty 38, 135K searches a month, traffic potential, volume in six countries and keyword ideas"
            />
          </div>
        </div>
      </section>

      {/* Stat strip: the night band, figures in orange */}
      <Band tone="night" space="sm" label="OpenSEO in four numbers">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {ledger.map((item) => (
            <div key={item.label} className="flex flex-col-reverse items-center gap-3 text-center lg:border-l lg:border-line lg:first:border-l-0">
              <dt className="max-w-[14rem] text-sm text-balance text-muted">{item.label}</dt>
              <dd className="figure text-orange">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Band>

      {/* The research tools, one split section each, alternating side and tone. The agent server comes
          straight after the first, on its night band between two light ones. */}
      {tour.map((stop, index) => (
        <Fragment key={stop.id}>
          <TourSection stop={stop} tone={TOUR_TONES[index % TOUR_TONES.length]} flip={index % 2 === 1} />
          {index === 0 && <AgentFold />}
        </Fragment>
      ))}

      {/* Everything else */}
      <Band tone="white" labelledBy="features-title" className="border-t border-line">
        <SectionHeader
          align="center"
          eyebrow="Features"
          id="features-title"
          title="AI visibility, rank tracking and site audits"
          lede="AI visibility without a subscription, rank tracking from $0.02 a check, site audits, Search Console, local rank tracking and the agent tools, each with its own page on what it does and what it costs."
        />
        <div className="mt-14 md:mt-16">
          <FeatureGrid />
        </div>
        <p className="mt-12 text-center">
          <ButtonLink href="/features" variant="secondary">
            All features
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </p>
      </Band>

      {/* You are in control */}
      <Band tone="peach" labelledBy="control-title">
        <SectionHeader
          align="center"
          eyebrow="You are in control"
          id="control-title"
          title="Why open-source SEO software"
          lede="Closed suites decide what you see, where your data goes and what you pay. OpenSEO is built the other way round."
        />
        <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:gap-6">
          {control.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.title} className="card p-8">
                <span className={`tile ${index % 2 === 1 ? 'tile-peach' : ''}`}>
                  <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <h3 className="text-heading mt-6">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 text-center">
          <ButtonLink href="/why-openseo" variant="ghost">
            Why OpenSEO
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </p>
      </Band>

      {/* Self-host: copy on one side, the command on the other */}
      <Band tone="cream" labelledBy="selfhost-title">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div className="max-w-xl">
            <p className="eyebrow">Self-host</p>
            <h2 id="selfhost-title" className="text-title mt-4">
              Self-hosted SEO tools with Docker
            </h2>
            <p className="text-lede mt-6">Everything this site runs is in the repository. Start it on your own machine or server with Docker, and it is yours.</p>
            <ul className="mt-8 space-y-3">
              {selfHostPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-ink">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">
                    <Check className="size-3" aria-hidden="true" strokeWidth={3} />
                  </span>
                  <span className="text-[0.9375rem]">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/docs/self-hosting" variant="night">
                Self-hosting guide
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href={GITHUB_URL} variant="secondary">
                <BrandIcon brand="github" />
                Source on GitHub
              </ButtonLink>
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted">
              <span className="inline-flex items-center gap-2"><BrandIcon brand="docker" className="size-5" />Docker</span>
              <span className="inline-flex items-center gap-2"><BrandIcon brand="postgresql" className="size-5" />PostgreSQL</span>
              <span className="inline-flex items-center gap-2"><BrandIcon brand="github" className="size-5" />Open source</span>
            </p>
          </div>
          <div className="frame-glow min-w-0">
            <CodeBlock label="Terminal" code={selfHostDocker} />
          </div>
        </div>
      </Band>

      <YepapiOffer />

      <CtaBand />
    </>
  );
}
