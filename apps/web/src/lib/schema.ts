import { SITE_URL } from './site';

export interface Crumb {
  name: string;
  /** Path beginning with "/". */
  path: string;
}

/** BreadcrumbList JSON-LD. The home page is added as the first item. */
export function breadcrumbList(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path === '/' ? '' : crumb.path}`,
    })),
  };
}

/** FAQPage JSON-LD from question and answer paragraphs. */
export function faqPage(faqs: { question: string; answer: string[] }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer.join(' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`([^`]+)`/g, '$1') },
    })),
  };
}
