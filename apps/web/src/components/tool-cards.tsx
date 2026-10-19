import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ResearchTool } from '@/content/tools';
import { toolImages } from '@/content/tool-images';
import { ScreenImage } from './screenshot';

/**
 * The research tools as cards: the tool's illustration, its keyword-led title (the page's H1) and,
 * where the app calls it something else, the name to look for in the app.
 */
export function ToolCards({ tools }: { tools: ResearchTool[] }) {
  return (
    <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const picture = toolImages[tool.slug];
        const appName = tool.name.toLowerCase() !== tool.h1.toLowerCase() ? tool.name : null;
        return (
          <li key={tool.slug} className="card card-link group relative flex flex-col overflow-hidden rounded-xl p-0">
            <div className="aspect-[16/10] overflow-hidden border-b border-line bg-peach">
              {picture ? (
                <Image
                  src={picture.src}
                  alt={picture.alt}
                  width={picture.width}
                  height={picture.height}
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <ScreenImage name={tool.hero.shot} alt="" thumbnail />
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="card-title flex items-center gap-2.5">
                <Icon className="size-5 shrink-0 text-accent-text" aria-hidden="true" strokeWidth={1.75} />
                <Link href={`/tools/${tool.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                  {tool.h1}
                </Link>
              </h3>
              {appName && <p className="mt-1 font-mono text-xs text-faint">In the app: {appName}</p>}
              <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-muted">{tool.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text" aria-hidden="true">
                Learn more
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
