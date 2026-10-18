import type { Metadata } from 'next';
import { SITE_NAME } from './site';

interface PageMetaInput {
  title: string;
  description: string;
  /** Path beginning with "/". Resolved against metadataBase. */
  path: string;
  /** Use the title as-is instead of applying the "%s · OpenSEO" template. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
  /** A glossary slug whose illustration goes on the social image. */
  ogIllustration?: string;
  /** Text for the social image when the title tag is not the best headline. */
  ogTitle?: string;
}

/** The section label on a page's social image, from its path. */
function sectionOf(path: string): string {
  const first = path.split('/')[1] ?? '';
  return (
    {
      tools: 'SEO tools',
      features: 'Features',
      glossary: 'SEO glossary',
      docs: path.startsWith('/docs/tutorials') ? 'Tutorial' : 'Docs',
      compare: 'Comparison',
      pricing: 'Pricing',
    }[first] ?? ''
  );
}

/** Every page gets its own social image, drawn by /og from its title and section. */
export function ogImageUrl(title: string, path: string, illustration?: string): string {
  const params = new URLSearchParams({ t: title.replace(/\s+·\s+OpenSEO$/, '') });
  const section = sectionOf(path);
  if (section) params.set('s', section);
  if (illustration) params.set('img', illustration);
  return `/og?${params.toString()}`;
}

/** Per-page metadata: title, description, canonical, Open Graph and Twitter tags. */
export function pageMeta({ title, description, path, absoluteTitle, noIndex, ogIllustration, ogTitle }: PageMetaInput): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  const images = [{ url: ogImageUrl(ogTitle ?? title, path, ogIllustration), width: 1200, height: 630, alt: ogTitle ?? title }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en',
      title: socialTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: images.map((image) => image.url),
    },
  };
}
