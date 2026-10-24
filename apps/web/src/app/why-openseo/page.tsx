import Link from 'next/link';
import { ArrowRight, Bot, Briefcase, Check, Code2, Server, ShieldCheck, Store, Terminal } from 'lucide-react';
import { Band } from '@/components/band';
import { BrandIcon } from '@/components/brand-icon';
import { ButtonLink } from '@/components/button';
import { CtaBand } from '@/components/cta-band';
import { FaqList } from '@/components/faq';
import { JsonLd } from '@/components/json-ld';
import { SectionHeader } from '@/components/section';
import { audiences, differences, skills, whyFaqs } from '@/content/why';
import { pageMeta } from '@/lib/metadata';
import { breadcrumbList, faqPage } from '@/lib/schema';
import { GITHUB_URL, SIGN_UP_URL, SITE_URL } from '@/lib/site';

const path = '/why-openseo';

export const metadata = pageMeta({
  title: 'Why OpenSEO? The Open-Source SEO Platform You Control',
  description:
    'What OpenSEO is, who it is for and how it differs: a free, MIT-licensed SEO platform you can self-host, with an MCP server for Claude, ChatGPT and other AI agents.',
  path,
  absoluteTitle: true,
});

const textLink = 'font-medium text-accent-text underline decoration-accent-line underline-offset-4 transition-colors hover:decoration-accent';
const audienceIcons = [Store, Briefcase, Terminal];
const differenceIcons = [Code2, Server, ShieldCheck, Bot];

/** The brand page: answers "what is OpenSEO?" plainly, for people and for the AI answers that quote it. */
export default function WhyOpenSeoPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            faqPage(whyFaqs),
            breadcrumbList([{ name: 'Why OpenSEO', path }]),
            {
              '@type': 'AboutPage',
              name: 'Why OpenSEO',
              url: `${SITE_URL}${path}`,
              about: {
                '@type': 'SoftwareApplication',
                name: 'OpenSEO',
                url: SITE_URL,
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web, Docker',
                license: 'https://opensource.org/licenses/MIT',
                codeRepository: GITHUB_URL,
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              },
            },
          ],
        }}
      />

      {/* Header */}
      <section aria-labelledby="why-title" className="band-cream relative overflow-hidden">
        <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-page relative py-20 text-center md:py-28">
          <p className="eyebrow">About the project</p>
          <h1 id="why-title" className="text-display mx-auto mt-5 max-w-3xl text-balance">
            Why <span className="mark">OpenSEO</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-pretty text-muted">
            OpenSEO is a free, open-source SEO platform for you and your AI agent. Research keywords, track rankings, audit
            your site and watch how AI assistants talk about you, online or on your own server, with every line of code in
            the open.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href={SIGN_UP_URL} size="lg">
              Get started
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={GITHUB_URL} size="lg" variant="secondary">
              <BrandIcon brand="github" />
              Source on GitHub
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* What it is */}
      <Band tone="white" space="md" labelledBy="what-title">
        <div className="mx-auto max-w-3xl">
          <h2 id="what-title" className="text-title text-balance">
            What is OpenSEO?
          </h2>
          <p className="text-lede mt-6">
            OpenSEO is an open-source SEO suite, MIT licensed, that you can use at openseo.gg or self-host with Docker. It
            covers <Link href="/tools/keyword-analysis-tool" className={textLink}>keyword research</Link>,{' '}
            <Link href="/features/keyword-rank-tracker" className={textLink}>rank tracking</Link>, backlinks,{' '}
            <Link href="/features/site-audit" className={textLink}>site audits</Link>,{' '}
            <Link href="/features/ai-visibility-tracker" className={textLink}>AI visibility</Link>, local rankings and{' '}
            <Link href="/features/search-console-dashboard" className={textLink}>Search Console reports</Link>.
          </p>
          <p className="mt-5 leading-relaxed text-muted">
            It is built for people who want SEO data without a monthly suite: the software costs nothing, and the search data
            you look up is billed per lookup to your own key, under a limit you set. AI agents can use every feature through
            the <Link href="/features/seo-mcp-server" className={textLink}>OpenSEO MCP server</Link>, so you can ask Claude or
            ChatGPT to do the research and save the results to your project.
          </p>
        </div>
      </Band>

      {/* Who it is for */}
      <Band tone="peach" labelledBy="who-title">
        <SectionHeader
          eyebrow="Who it is for"
          id="who-title"
          title="Who OpenSEO is for"
          lede="Three kinds of people use it most, and the same workspace serves all three."
        />
        <ul className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 md:mt-16 lg:grid-cols-3 lg:gap-6">
          {audiences.map((item, index) => {
            const Icon = audienceIcons[index] ?? Store;
            return (
              <li key={item.title} className="card flex flex-col p-8">
                <span className={`tile ${index % 2 === 1 ? 'tile-peach' : ''}`}>
                  <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <h3 className="card-title mt-6">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
                {item.points ? (
                  <ul className="mt-6 space-y-3">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[0.9375rem]">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden="true" strokeWidth={2.5} />
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </Band>

      {/* What sets it apart */}
      <Band tone="cream" labelledBy="different-title">
        <SectionHeader
          eyebrow="You are in control"
          id="different-title"
          title="What makes OpenSEO different"
          lede="Closed suites decide what you see, where your data goes and what you pay. OpenSEO is built the other way round."
        />
        <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 lg:gap-6">
          {differences.map((item, index) => {
            const Icon = differenceIcons[index] ?? Code2;
            return (
              <li key={item.title} className="card p-8">
                <span className={`tile ${index % 2 === 1 ? 'tile-peach' : ''}`}>
                  <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <h3 className="card-title mt-6">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </Band>

      {/* Agents */}
      <Band tone="night" labelledBy="agent-title">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div className="max-w-xl">
            <p className="eyebrow">AI agents</p>
            <h2 id="agent-title" className="text-title mt-4 text-balance">
              OpenSEO with your AI agent
            </h2>
            <p className="text-lede mt-6">
              Connect the agent you already use and it gets the whole workspace: live search data, your projects and a place
              to save its work.
            </p>
            <p className="mt-5 leading-relaxed text-muted">
              Each project keeps shared notes on your goals, audience and competitors, so the agent remembers your business
              between sessions. Skills give it a process to follow, and you can change them to match your own.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/docs/mcp">
                Connect your agent
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/best-seo-mcp-servers" variant="secondary">
                Compare SEO MCP servers
              </ButtonLink>
            </div>
          </div>
          <div className="card min-w-0 p-7 md:p-8">
            <h3 className="card-title">OpenSEO skills for agents</h3>
            <ul className="mt-5 divide-y divide-line">
              {skills.map((skill) => (
                <li key={skill.name} className="py-4 first:pt-0 last:pb-0">
                  <p className="font-semibold text-ink">{skill.name}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{skill.what}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      {/* Hosted or self-hosted */}
      <Band tone="white" labelledBy="run-title">
        <SectionHeader
          eyebrow="Two ways to run it"
          id="run-title"
          title="Hosted or self-hosted OpenSEO"
          lede="The same code runs both. Pick the one that suits you, and switch whenever you like."
        />
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:mt-16 lg:grid-cols-2">
          <article aria-labelledby="hosted-title" className="card flex flex-col p-8 md:p-10">
            <h3 id="hosted-title" className="text-heading">
              Hosted at openseo.gg
            </h3>
            <p className="mt-4 leading-relaxed text-muted">
              Sign up and start in a minute. Every feature is unlimited today. OpenSEO is an early, independent project, so
              the hosted app may get usage limits later; if it does, we will say so well in advance.
            </p>
            <div className="mt-auto pt-8">
              <ButtonLink href={SIGN_UP_URL} className="w-full">
                Get started
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </article>
          <article aria-labelledby="self-title" className="card card-featured flex flex-col p-8 md:p-10">
            <h3 id="self-title" className="text-heading">
              Self-hosted with Docker
            </h3>
            <p className="mt-4 leading-relaxed text-muted">
              Run the whole suite on your PC, a home server or a small cloud server. Every feature is unlocked and unlimited
              for good, and your data never leaves your database unless you send it.
            </p>
            <div className="mt-auto pt-8">
              <ButtonLink href="/docs/self-hosting" variant="secondary" className="w-full">
                Self-hosting guide
              </ButtonLink>
            </div>
          </article>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-[0.9375rem] text-muted">
          See <Link href="/pricing" className={textLink}>pricing</Link> for what search data costs per lookup, or how
          OpenSEO compares with <Link href="/compare/ahrefs-alternative" className={textLink}>Ahrefs</Link> and{' '}
          <Link href="/compare/semrush-alternative" className={textLink}>Semrush</Link>.
        </p>
      </Band>

      {/* FAQ */}
      <Band tone="cream" labelledBy="faq-title">
        <SectionHeader eyebrow="FAQ" id="faq-title" title="OpenSEO FAQ" />
        <div className="mx-auto mt-12 max-w-3xl">
          <FaqList faqs={whyFaqs} />
        </div>
      </Band>

      <CtaBand />
    </>
  );
}
