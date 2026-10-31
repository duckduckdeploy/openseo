/**
 * Running out of YepAPI credit. Most people start with the $5 free credit YepAPI gives new
 * accounts; once it is spent, every paid lookup fails with 402 `yepapi_no_credits` until they top
 * up. Any request that gets that answer announces it here, and the shell shows one top-up prompt
 * (see components/top-up.tsx) whichever tool hit it.
 */

/** YepAPI's billing page (it asks to sign in first when needed). */
export const YEPAPI_TOP_UP_URL = "https://www.yepapi.com/dashboard/billing";

export const NO_CREDITS_CODE = "yepapi_no_credits";
export const NO_CREDITS_EVENT = "openseo:no-credits";

// Background runs store the API's message as text, so a stored error is recognised by it too.
const NO_CREDITS_TEXT = /out of credits|insufficient (balance|credits)|no credits left/i;

/** True for an out-of-credits error: an API error with the code, or an error or run message saying so. */
export function isNoCredits(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "string") return NO_CREDITS_TEXT.test(error);
  const e = error as { code?: unknown; message?: unknown };
  return e.code === NO_CREDITS_CODE || (typeof e.message === "string" && NO_CREDITS_TEXT.test(e.message));
}

/** Tells the shell to show the top-up prompt. */
export function announceNoCredits() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(NO_CREDITS_EVENT));
}
