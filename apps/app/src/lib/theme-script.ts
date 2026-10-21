export const THEME_KEY = "openseo_theme";

/**
 * Runs in <head> before the first paint, so a page never flashes the wrong theme. Self-contained:
 * reads the choice from the cookie, then localStorage, and sets <html data-theme>. No choice
 * means the system setting (see globals.css). The cookie is on the parent domain, shared with the
 * website (apps/web/src/lib/theme.ts), so a choice made on either applies to both.
 */
export const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_KEY}=(light|dark)/),t=m&&m[1];if(!t){try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}}if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
