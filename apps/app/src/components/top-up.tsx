"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Wallet, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { NO_CREDITS_EVENT, YEPAPI_TOP_UP_URL } from "@/lib/credits";
import { useBalance } from "./balance";
import { Button } from "./ui";

// After the prompt is closed, further out-of-credit errors (several lookups fail together) do not
// reopen it for a while; the inline notes and the balance strip still say what happened.
const QUIET_MS = 5 * 60_000;

/**
 * The prompt shown when a lookup fails because the YepAPI balance is empty. Mounted once in the
 * shell; any request answered with `yepapi_no_credits` opens it (see lib/credits.ts).
 */
export function OutOfCreditsDialog() {
  const [open, setOpen] = useState(false);
  const closedAt = useRef(0);
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const queryClient = useQueryClient();
  const balance = useBalance();

  useEffect(() => {
    const onNoCredits = () => {
      // The balance strip and sidebar should show the empty balance straight away.
      void queryClient.invalidateQueries({ queryKey: ["balance"] });
      if (Date.now() - closedAt.current > QUIET_MS) setOpen(true);
    };
    window.addEventListener(NO_CREDITS_EVENT, onNoCredits);
    return () => window.removeEventListener(NO_CREDITS_EVENT, onNoCredits);
  }, [queryClient]);

  // Native <dialog>: focus trap, Escape and focus return come with it.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  const close = () => {
    closedAt.current = Date.now();
    setOpen(false);
  };

  const recheck = async () => {
    const result = await balance.refetch();
    const amount = result.data?.balanceUsd;
    // Closed once the balance is back (or cannot be read); the next run shows whether it worked.
    if (amount == null || amount > 0) {
      closedAt.current = 0;
      setOpen(false);
    }
  };

  const amount = balance.data?.available ? balance.data.balanceUsd : null;
  const stillEmpty = !balance.isFetching && amount != null && amount <= 0;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-line bg-surface p-0 text-ink shadow-pop backdrop:bg-bg/70"
    >
      {open && (
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 id={titleId} className="flex items-center gap-2 font-display text-base font-semibold">
              <Wallet className="size-4 text-neg" aria-hidden />
              Your YepAPI credit has run out
            </h2>
            <button type="button" onClick={close} aria-label="Close" className="-mr-1 -mt-1 shrink-0 rounded-md p-1.5 text-muted hover:bg-sunken hover:text-ink">
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <div className="space-y-2 text-[13px] text-muted">
            <p>
              OpenSEO runs every lookup on your own YepAPI account, and its balance is used up. That includes the free credit new YepAPI accounts start with.
            </p>
            <p>Top up your YepAPI balance to keep using the tools. Scheduled checks will fail until you do. The calls that failed were not charged.</p>
          </div>
          {stillEmpty && <p className="text-[13px] text-neg">YepAPI still reports an empty balance. A top-up can take a minute to show.</p>}
          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => void recheck()} loading={balance.isFetching}>
              I&apos;ve topped up
            </Button>
            <a
              href={YEPAPI_TOP_UP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-accent bg-accent px-3.5 text-sm font-medium text-accent-fg shadow-card hover:border-accent-hover hover:bg-accent-hover"
            >
              Top up on YepAPI <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
