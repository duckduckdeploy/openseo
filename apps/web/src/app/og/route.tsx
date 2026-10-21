import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/**
 * The social preview image for any page: /og?t=<title>&s=<section>[&img=<glossary slug>].
 * pageMeta() points every page here, so each page gets its own image in the site's style.
 */
export const dynamic = 'force-dynamic';

const PUBLIC = join(process.cwd(), 'public');

let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 600 | 700; style: 'normal' }[]> | null = null;
const loadFonts = () =>
  (fonts ??= Promise.all([
    readFile(join(PUBLIC, 'fonts/bricolage-700.ttf')).then((data) => ({ name: 'Bricolage', data, weight: 700 as const, style: 'normal' as const })),
    readFile(join(PUBLIC, 'fonts/plex-sans-500.ttf')).then((data) => ({ name: 'Plex', data, weight: 500 as const, style: 'normal' as const })),
    readFile(join(PUBLIC, 'fonts/plex-sans-600.ttf')).then((data) => ({ name: 'Plex', data, weight: 600 as const, style: 'normal' as const })),
  ]));

const C = { cream: '#fbf8f3', ink: '#17130f', muted: '#544c44', blue: '#2350e6', peach: '#fdeee2', peachStrong: '#f8cfae', peachText: '#8a3a0a', orange: '#f2681c', night: '#15110e', nightText: '#f7f0e7' };

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const title = (params.get('t') || 'Open-source SEO tools you control').slice(0, 140);
  const section = (params.get('s') || '').slice(0, 40);
  const slug = params.get('img');

  let illustration: string | null = null;
  if (slug && /^[a-z0-9-]+$/.test(slug)) {
    try {
      illustration = `data:image/jpeg;base64,${(await readFile(join(PUBLIC, 'images/glossary/og', `${slug}.jpg`))).toString('base64')}`;
    } catch {
      illustration = null;
    }
  }

  const long = title.length;
  const size = illustration ? (long <= 34 ? 64 : long <= 60 ? 54 : 46) : long <= 40 ? 80 : long <= 70 ? 66 : 54;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Plex',
          // Opaque stops only (the renderer turns transparent stops black): peach left, cream middle, blue right.
          backgroundColor: C.cream,
          backgroundImage: 'linear-gradient(120deg, #f8d6bc 0%, #fbf8f3 34%, #fbf8f3 62%, #d9e2fb 100%)',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '56px 72px 40px', gap: 48 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {section ? (
              <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', background: C.peach, border: `2px solid ${C.peachStrong}`, color: C.peachText, fontSize: 24, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', borderRadius: 999, padding: '8px 20px' }}>
                  {section}
                </div>
              </div>
            ) : null}
            <div style={{ display: 'flex', marginTop: section ? 28 : 0, fontFamily: 'Bricolage', fontWeight: 700, fontSize: size, lineHeight: 1.04, letterSpacing: -size * 0.03, color: C.ink }}>{title}</div>
            <div style={{ display: 'flex', marginTop: 28, width: 96, height: 8, borderRadius: 8, background: C.orange }} />
          </div>
          {illustration ? (
            <div style={{ display: 'flex', width: 470, height: 264, borderRadius: 24, overflow: 'hidden', border: `10px solid #ffffff`, boxShadow: '0 30px 60px -20px rgba(40,24,10,0.35)' }}>
              <img src={illustration} width={450} height={253} style={{ objectFit: 'cover' }} alt="" />
            </div>
          ) : null}
        </div>

        {/* Night bar: logo and address */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.night, padding: '26px 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="44" height="44" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="8" fill={C.blue} />
              <circle cx="14" cy="14" r="6.5" fill="none" stroke="#ffffff" strokeWidth="4" />
              <path d="M19.5 19.5 25 25" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 700, fontSize: 34, color: C.nightText }}>OpenSEO</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: '#c6b9ab' }}>
            <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 10, background: C.orange }} />
            Open source · openseo.gg
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: await loadFonts(),
      headers: { 'cache-control': 'public, max-age=86400, s-maxage=2592000, immutable' },
    },
  );
}
