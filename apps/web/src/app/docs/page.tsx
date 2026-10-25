import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Library, Server, type LucideIcon } from 'lucide-react';
import { StatusNote } from '@/components/section';
import { docSections, docsIn, type DocSection } from '@/content/docs';
import { pageMeta } from '@/lib/metadata';

export const metadata = pageMeta({
  title: 'Docs: SEO Tutorials, Self-Hosting and API Reference',
  description: 'How OpenSEO works, step-by-step tutorials for every feature, self-hosting, and the REST API, MCP and audit references.',
  path: '/docs',
});

const intro: Record<string, string> = {
  'Start here': 'Set up your account and understand the model: where the data comes from and what it costs.',
  Tutorials: 'One walkthrough per feature, from an empty project to results you can act on.',
  'Run it yourself': 'Run the whole stack on your own machine or server.',
  Reference: 'The details: every API route, MCP tool, audit check and error code.',
};

const SECTION_ICON: Record<DocSection, LucideIcon> = {
  'Start here': BookOpen,
  Tutorials: GraduationCap,
  'Run it yourself': Server,
  Reference: Library,
};

export default function DocsIndexPage() {
  return (
    <div className="min-w-0">
      <p className="eyebrow">Docs</p>
      <h1 className="text-title mt-5">OpenSEO docs and SEO tutorials</h1>
      <p className="text-lede mt-5 max-w-2xl text-pretty">
        Start with how OpenSEO works and what it costs, then follow a tutorial for the feature you need. The reference
        pages cover the REST API, the MCP server and every audit check.
      </p>

      <div className="mt-14 space-y-16">
        {docSections.map((section, index) => {
          const Icon = SECTION_ICON[section];
          return (
            <section key={section} aria-labelledby={`section-${section}`}>
              <div className="flex items-start gap-4">
                <span className={`tile shrink-0 ${index % 2 === 1 ? 'tile-peach' : ''}`}>
                  <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 id={`section-${section}`} className="text-heading">
                    {section}
                  </h2>
                  <p className="mt-1 text-muted">{intro[section]}</p>
                </div>
              </div>
              <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {docsIn(section).map((doc) => (
                  <li key={doc.slug} className="card card-link group flex items-start gap-4 p-5">
                    <div className="min-w-0 flex-1">
                      <h3 className="card-title">
                        <Link href={`/docs/${doc.slug}`} className="after:absolute after:inset-0 group-hover:text-accent-text focus-visible:outline-none">
                          {doc.title}
                        </Link>
                      </h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{doc.description}</p>
                    </div>
                    <ArrowRight className="mt-1 size-5 shrink-0 text-faint transition-[transform,color] duration-150 group-hover:translate-x-1 group-hover:text-accent-text" aria-hidden="true" />
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      <div className="mt-14 max-w-3xl">
        <StatusNote>OpenSEO is released and gets active updates. The docs describe what the current version does.</StatusNote>
      </div>
    </div>
  );
}
