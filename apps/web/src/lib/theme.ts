/**
 * The reader's theme choice: "light", "dark", or none for the system setting. Kept in a cookie
 * on the parent domain, so the site and the app (apps/app/src/lib/theme-script.ts) share it, with
 * localStorage as a fallback where cookies are blocked.
 */
export const THEME_KEY = 'openseo_theme';

export type Theme = 'system' | 'light' | 'dark';

/** The dark screenshot's media query with no choice made: the system setting. */
export const DARK_MEDIA = '(prefers-color-scheme: dark)';

/** The media query that makes a dark <source> match the reader's choice. */
const darkMedia = (theme: Theme) => (theme === 'dark' ? 'all' : theme === 'light' ? 'not all' : DARK_MEDIA);

/**
 * Runs in <head> before the first paint, so a page never flashes the wrong theme: sets
 * <html data-theme> from the cookie, then localStorage. No choice means the system setting.
 * With a choice, it also points every dark screenshot <source data-theme-dark> at that theme as
 * the parser (or React) adds it. Mutation observers run as microtasks, so for images in the
 * server HTML the browser may already have picked a source by then: a reader whose choice differs
 * from the system setting can download both versions of the first few images. Later ones, and
 * everything React adds, download only the one on screen.
 */
export const themeScript = `(function(){try{var d=document.documentElement,m=document.cookie.match(/(?:^|; )${THEME_KEY}=(light|dark)/),t=m&&m[1];if(!t){try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}}if(t==="light"||t==="dark")d.setAttribute("data-theme",t);function fix(n,q){if(n.nodeType!==1)return;if(n.matches("source[data-theme-dark]"))n.media=q;else{var s=n.querySelectorAll("source[data-theme-dark]");for(var i=0;i<s.length;i++)s[i].media=q}}new MutationObserver(function(r){var a=d.getAttribute("data-theme");if(a!=="light"&&a!=="dark")return;var q=a==="dark"?"all":"not all";for(var i=0;i<r.length;i++)for(var j=0;j<r[i].addedNodes.length;j++)fix(r[i].addedNodes[j],q)}).observe(d,{childList:true,subtree:true})}catch(e){}})()`;

export function readTheme(): Theme {
  const value = document.documentElement.getAttribute('data-theme');
  return value === 'light' || value === 'dark' ? value : 'system';
}

/** Whether the page is showing its dark theme now: the reader's choice, else the system's. */
export function isDark(): boolean {
  const theme = readTheme();
  return theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

export function applyTheme(theme: Theme) {
  if (theme === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);
  for (const source of document.querySelectorAll<HTMLSourceElement>('source[data-theme-dark]')) source.media = darkMedia(theme);
  try {
    if (theme === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the cookie still remembers it.
  }
  // On openseo.gg and its subdomains the cookie is shared with the app.
  const domain = /(^|\.)openseo\.gg$/.test(location.hostname) ? '; domain=openseo.gg' : '';
  // Clear any older cookie set on this host only, so it cannot shadow the shared one.
  if (domain) document.cookie = `${THEME_KEY}=; path=/; max-age=0; samesite=lax`;
  document.cookie =
    theme === 'system'
      ? `${THEME_KEY}=; path=/; max-age=0; samesite=lax${domain}`
      : `${THEME_KEY}=${theme}; path=/; max-age=31536000; samesite=lax${domain}`;
}
