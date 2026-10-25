"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, ArrowLeft, ArrowRight, BarChart3, Bot, Check, Copy, ExternalLink, KeyRound, Link2, Lock, Mail, Search, Star, TrendingUp, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { Button, cx, ErrorNote, Spinner } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { type Me, signOut } from "@/lib/auth";
import { useMe } from "@/lib/hooks";

const YEPAPI_SIGN_UP = "https://yepapi.com?ref=openseo";
const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL?.trim().replace(/\/+$/, "") || "https://github.com/duckduckdeploy/openseo";
const FEEDBACK_EMAIL = "info@openseo.gg";

const STEPS = [
  { label: "Your key", art: "/onboarding/key.webp" },
  { label: "Projects", art: "/onboarding/project.webp" },
  { label: "GitHub", art: "/onboarding/star.webp" },
  { label: "Feedback", art: "/onboarding/feedback.webp" },
] as const;

const TOOLS = [
  { icon: Search, title: "Keyword research", text: "Search volume, difficulty and fresh ideas" },
  { icon: TrendingUp, title: "Rank tracking", text: "Your Google positions, checked on a schedule" },
  { icon: Activity, title: "Site audit", text: "Crawl your site and fix what holds it back" },
  { icon: Link2, title: "Backlinks", text: "Who links to you and to your competitors" },
  { icon: Bot, title: "AI visibility", text: "How ChatGPT, Gemini and others mention you" },
  { icon: BarChart3, title: "Search Console", text: "Your real clicks, keywords and indexing" },
];

/** Delay index for the staggered entrance (globals.css .ob-rise). */
const rise = (i: number) => ({ "--i": i }) as CSSProperties;

/** A ring of small pieces flying out from the centre, for moments worth celebrating. */
function Burst({ count = 18 }: { count?: number }) {
  const colours = ["var(--color-accent)", "var(--color-series-2)", "var(--color-series-4)", "var(--color-series-3)", "var(--color-series-7)"];
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="ob-spark"
          style={{ "--r": `${(360 / count) * i}deg`, "--d": `${-44 - (i % 3) * 16}px`, background: colours[i % colours.length], animationDelay: `${(i % 4) * 25}ms` } as CSSProperties}
        />
      ))}
    </span>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-3">
      <ol className="flex items-center gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((item, i) => (
          <li key={item.label} className="relative h-1.5 w-8 overflow-hidden rounded-full bg-line sm:w-12" aria-current={i === step ? "step" : undefined}>
            <span className={cx("absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-700 ease-out", i <= step ? "w-full" : "w-0")} />
            <span className="sr-only">{item.label}</span>
          </li>
        ))}
      </ol>
      <span className="hidden font-mono text-[11px] uppercase tracking-wide text-faint sm:inline">{STEPS[step]?.label}</span>
    </div>
  );
}

/** The step's illustration, floating on a soft warm glow, with optional chips laid over it. */
function Art({ src, children }: { src: string; children?: ReactNode }) {
  return (
    <div className="ob-art relative mx-auto aspect-[16/10] w-full max-w-md lg:max-w-none">
      <div aria-hidden className="ob-glow absolute inset-[6%] rounded-full blur-3xl" />
      <img
        src={src}
        alt=""
        width={1600}
        height={1000}
        className="ob-float ob-picture relative size-full object-cover"
      />
      {children}
    </div>
  );
}

function Chip({ className, delay = 0, children }: { className: string; delay?: number; children: ReactNode }) {
  return (
    <div className={cx("absolute", className)}>
      <div className="ob-pop" style={{ animationDelay: `${0.5 + delay}s` }}>
        <div className="ob-float flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-ink shadow-pop" style={{ "--delay": `${delay}s` } as CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="ob-rise font-mono text-[11px] uppercase tracking-wider text-accent-text" style={rise(0)}>
      {children}
    </p>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="ob-rise mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]" style={rise(1)}>
      {children}
    </h1>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="ob-rise mt-4 max-w-xl text-[15px] leading-relaxed text-pretty text-muted" style={rise(2)}>
      {children}
    </p>
  );
}

/** Step 1: get a YepAPI key and connect it. Nothing else works without it, so there is no skip. */
function KeyStep({ settings, onNext }: { settings: Me["settings"]; onNext: () => void }) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [justConnected, setJustConnected] = useState(false);
  const save = useMutation({
    mutationFn: () => api<Me["settings"]>("/settings/yepapi-key", { method: "PUT", body: { apiKey: value.trim() } }),
    onSuccess: (next) => {
      setValue("");
      setJustConnected(true);
      queryClient.setQueryData<Me>(["me"], (old) => (old ? { ...old, settings: next } : old));
      void queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });

  const howTo = [
    {
      title: "Create a free YepAPI account",
      body: (
        <a href={YEPAPI_SIGN_UP} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-edge bg-surface px-2.5 py-1 text-[13px] font-medium text-ink transition-colors hover:border-faint">
          Open yepapi.com <ExternalLink className="size-3.5" aria-hidden />
        </a>
      ),
    },
    { title: "Copy your API key", body: <p className="text-[13px] text-muted">It's on your YepAPI dashboard and starts with yep_sk_.</p> },
    { title: "Paste it below", body: <p className="text-[13px] text-muted">We check it with YepAPI, then you're in.</p> },
  ];

  return (
    <>
      <Eyebrow>Step 1 · Connect your data</Eyebrow>
      <Title>Let's get your free YepAPI key</Title>
      <Lead>
        OpenSEO's SEO data comes from YepAPI. Sign up and you get{" "}
        <span className="rounded bg-price-bg px-1.5 py-0.5 font-medium whitespace-nowrap text-price">$5 free credit</span>, with no credit card required. That's
        enough to try every tool.
      </Lead>

      {settings.hasYepapiKey ? (
        <div className="ob-pop mt-8 flex items-center gap-4 rounded-xl border border-pos/30 bg-pos/5 p-4">
          <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-pos text-white">
            {justConnected && <Burst />}
            <svg viewBox="0 0 24 24" className="ob-check size-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold">Key connected</p>
            <p className="truncate font-mono text-xs text-muted">{settings.yepapiKeyHint}</p>
          </div>
          <Button variant="primary" className="ob-shine h-10 px-4" onClick={onNext} autoFocus>
            Continue <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      ) : (
        <>
          <ol className="mt-8 space-y-4">
            {howTo.map((item, i) => (
              <li key={item.title} className="ob-rise flex gap-3.5" style={rise(3 + i)}>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-xs font-semibold text-accent-text">{i + 1}</span>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold">{item.title}</p>
                  {item.body}
                </div>
              </li>
            ))}
          </ol>
          <form
            className="ob-rise mt-6 flex flex-col gap-2 sm:flex-row"
            style={rise(6)}
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate();
            }}
          >
            <label className="relative flex-1">
              <span className="sr-only">YepAPI key</span>
              <KeyRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" aria-hidden />
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                type="password"
                autoComplete="off"
                spellCheck={false}
                placeholder="yep_sk_…"
                required
                className="h-11 w-full rounded-lg border border-edge bg-surface pr-3 pl-10 font-mono text-sm text-ink placeholder:text-faint hover:border-faint focus:border-accent focus:ring-3 focus:ring-accent/20 focus:outline-none"
              />
            </label>
            <Button type="submit" variant="primary" className="h-11 px-5" loading={save.isPending} disabled={!value.trim()}>
              Connect key
            </Button>
          </form>
          <div className="mt-3">
            <ErrorNote error={save.error} />
          </div>
          <p className="ob-rise mt-3 flex items-center gap-1.5 text-xs text-faint" style={rise(7)}>
            <Lock className="size-3.5" aria-hidden /> Encrypted and never shown again. You pay YepAPI directly; OpenSEO adds nothing.
          </p>
        </>
      )}
    </>
  );
}

function StepNav({ onBack, onNext, nextLabel = "Continue", children }: { onBack: () => void; onNext?: () => void; nextLabel?: string; children?: ReactNode }) {
  return (
    <div className="ob-rise mt-9 flex flex-wrap items-center gap-2" style={rise(9)}>
      <Button variant="ghost" className="h-10" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden /> Back
      </Button>
      {children}
      {onNext && (
        <Button variant="primary" className="ob-shine h-10 px-5" onClick={onNext}>
          {nextLabel} <ArrowRight className="size-4" aria-hidden />
        </Button>
      )}
    </div>
  );
}

/** Step 2: what a project is, and the tools inside it. */
function TourStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <>
      <Eyebrow>Step 2 · How OpenSEO works</Eyebrow>
      <Title>One project for each website</Title>
      <Lead>Add your website as a project. OpenSEO keeps its keywords, rankings, audits and reports in one place, and keeps checking them over time.</Lead>
      <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
        {TOOLS.map((tool, i) => (
          <li
            key={tool.title}
            className="ob-rise group flex gap-3 rounded-lg border border-line bg-surface p-3 transition duration-300 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-pop"
            style={rise(3 + i * 0.6)}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <tool.icon className="size-[18px]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{tool.title}</p>
              <p className="text-[13px] leading-snug text-muted">{tool.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="ob-rise mt-5 flex items-start gap-2 text-[13px] text-muted" style={rise(8)}>
        <Wrench className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
        <span>
          Need a quick answer about any site? Every tool also works on its own under <span className="font-medium text-ink">SEO tools</span>, no project needed.
        </span>
      </p>
      <StepNav onBack={onBack} onNext={onNext} />
    </>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

/** Live star count from GitHub's public API. Hidden if it can't be read (rate limits, offline). */
function useStars() {
  const repo = GITHUB_URL.match(/github\.com\/([^/]+\/[^/]+)/)?.[1];
  return useQuery({
    queryKey: ["github-stars", repo],
    enabled: Boolean(repo),
    staleTime: 10 * 60_000,
    retry: false,
    queryFn: async () => {
      const response = await fetch(`https://api.github.com/repos/${repo}`);
      if (!response.ok) throw new Error(String(response.status));
      return ((await response.json()) as { stargazers_count: number }).stargazers_count;
    },
  });
}

/** Step 3: a star on GitHub. */
function StarStep({ starred, onStar, onBack, onNext }: { starred: boolean; onStar: () => void; onBack: () => void; onNext: () => void }) {
  const stars = useStars();
  return (
    <>
      <Eyebrow>Step 3 · Open source</Eyebrow>
      <Title>Help OpenSEO grow</Title>
      <Lead>OpenSEO is free and open source, built in the open on GitHub. A star takes a second and helps more people find it.</Lead>
      <div className="ob-rise mt-8" style={rise(3)}>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          onClick={onStar}
          className="group inline-flex h-12 items-stretch overflow-hidden rounded-lg border border-edge bg-surface text-sm font-semibold text-ink shadow-card transition hover:-translate-y-0.5 hover:border-faint hover:shadow-pop"
        >
          <span className="flex items-center gap-2.5 px-4">
            <GitHubMark className="size-5" />
            {starred ? "Thanks for the star!" : "Star on GitHub"}
          </span>
          <span className="relative flex items-center gap-1.5 border-l border-line bg-sunken px-4 font-mono text-[13px] tabular">
            <span className="relative grid place-items-center">
              {starred && <Burst count={14} />}
              <Star
                key={String(starred)}
                className={cx("size-4 transition-transform group-hover:scale-125 group-hover:rotate-12", starred ? "ob-pop fill-series-4 text-series-4" : "text-faint")}
                aria-hidden
              />
            </span>
            {stars.data != null ? stars.data.toLocaleString("en-US") : "Star"}
          </span>
        </a>
      </div>
      <p className="ob-rise mt-4 text-[13px] text-muted" style={rise(4)}>
        You can also report bugs, suggest features and follow new releases there.
      </p>
      <StepNav onBack={onBack} onNext={onNext} nextLabel={starred ? "Continue" : "Maybe later"} />
    </>
  );
}

/** Step 4: ask for feedback, then finish. */
function FeedbackStep({ onBack, onFinish, finishing, error }: { onBack: () => void; onFinish: (to: string) => void; finishing: string | null; error: unknown }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    await navigator.clipboard?.writeText(FEEDBACK_EMAIL).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  return (
    <>
      <Eyebrow>Step 4 · Feedback</Eyebrow>
      <Title>Tell us what you think</Title>
      <Lead>OpenSEO is shaped by the people who use it. Tell us what you like, what's missing or what broke. We read every message.</Lead>
      <div className="ob-rise mt-7 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-4" style={rise(3)}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-text">
          <Mail className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wide text-faint">Email us</p>
          <a href={`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent("OpenSEO feedback")}`} className="font-display text-lg font-semibold text-ink hover:text-accent-text">
            {FEEDBACK_EMAIL}
          </a>
        </div>
        <Button size="sm" onClick={copy} aria-live="polite">
          {copied ? <Check className="size-3.5 text-pos" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="ob-rise mt-9 border-t border-line pt-6" style={rise(5)}>
        <p className="font-display text-base font-semibold">You're all set.</p>
        <p className="mt-1 text-[13px] text-muted">Start with the website you want to grow.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="ghost" className="h-10" onClick={onBack}>
            <ArrowLeft className="size-4" aria-hidden /> Back
          </Button>
          <Button variant="primary" className="ob-shine h-10 px-5" loading={finishing === "/projects?new=1"} disabled={finishing != null} onClick={() => onFinish("/projects?new=1")}>
            Create your first project <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button className="h-10" loading={finishing === "/tools"} disabled={finishing != null} onClick={() => onFinish("/tools")}>
            Explore the tools
          </Button>
        </div>
        <div className="mt-3">
          <ErrorNote error={error} />
        </div>
      </div>
    </>
  );
}

export function Welcome() {
  const me = useMe();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [starred, setStarred] = useState(false);
  const [finishing, setFinishing] = useState<string | null>(null);

  const unauthenticated = me.error instanceof ApiError && me.error.status === 401;
  useEffect(() => {
    if (unauthenticated) router.replace("/sign-in?next=/welcome");
  }, [unauthenticated, router]);

  const finish = useMutation({
    mutationFn: (_to: string) => api<Me["settings"]>("/onboarding/complete", { method: "POST" }),
    onSuccess: (settings, to) => {
      queryClient.setQueryData<Me>(["me"], (old) => (old ? { ...old, settings } : old));
      router.replace(to);
    },
    onError: () => setFinishing(null),
  });

  if (me.isPending || unauthenticated) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner />
      </div>
    );
  }
  if (me.error) {
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <p className="font-display text-lg font-semibold">Can't reach the API</p>
          <p className="mt-1 text-sm text-muted">{me.error.message}</p>
        </div>
      </div>
    );
  }

  const settings = me.data.settings;
  const go = (to: number) => {
    // Nothing past the first step works without a key.
    if (to > 0 && !settings.hasYepapiKey) return;
    setDirection(to > step ? "next" : "back");
    setStep(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onFinish = (to: string) => {
    setFinishing(to);
    finish.mutate(to);
  };
  const onSignOut = async () => {
    await signOut().catch(() => {});
    queryClient.clear();
    router.replace("/sign-in");
  };

  const art = STEPS[step]?.art ?? STEPS[0].art;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-bg">
      {/* Soft drifting colour behind everything. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="ob-orb absolute -top-40 -left-32 size-[34rem] rounded-full bg-accent/10 blur-3xl" style={{ "--x": "60px", "--y": "40px" } as CSSProperties} />
        <div className="ob-orb absolute -right-40 bottom-[-12rem] size-[38rem] rounded-full bg-series-2/10 blur-3xl" style={{ "--x": "-50px", "--y": "-30px", animationDelay: "-6s" } as CSSProperties} />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <span className="text-lg">
          <Logo />
        </span>
        <Progress step={step} />
        <div className="flex items-center gap-1">
          {settings.hasYepapiKey && step < STEPS.length - 1 ? (
            <button type="button" onClick={() => onFinish("/projects")} disabled={finishing != null} className="rounded-md px-2.5 py-1.5 text-[13px] text-muted hover:bg-sunken hover:text-ink">
              Skip
            </button>
          ) : !settings.hasYepapiKey ? (
            <button type="button" onClick={onSignOut} className="rounded-md px-2.5 py-1.5 text-[13px] text-muted hover:bg-sunken hover:text-ink">
              Sign out
            </button>
          ) : (
            <span className="w-12" />
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl items-center gap-6 px-5 pt-2 pb-14 sm:px-8 lg:min-h-[calc(100dvh-5.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pb-20">
        <section key={step} className={cx("order-last lg:order-first", direction === "next" ? "ob-next" : "ob-back")} aria-live="polite">
          {step === 0 && <KeyStep settings={settings} onNext={() => go(1)} />}
          {step === 1 && <TourStep onBack={() => go(0)} onNext={() => go(2)} />}
          {step === 2 && <StarStep starred={starred} onStar={() => setStarred(true)} onBack={() => go(1)} onNext={() => go(3)} />}
          {step === 3 && <FeedbackStep onBack={() => go(2)} onFinish={onFinish} finishing={finishing} error={finish.error} />}
        </section>

        <Art key={art} src={art}>
          {step === 0 && (
            <>
              <Chip className="top-[10%] right-[4%]">
                <span className="font-mono text-price">$5</span> free credit
              </Chip>
              <Chip className="bottom-[12%] left-[2%]" delay={0.4}>
                <Check className="size-3.5 text-pos" aria-hidden /> No credit card
              </Chip>
            </>
          )}
          {step === 1 && (
            <Chip className="right-[6%] bottom-[8%]">
              <Search className="size-3.5 text-accent-text" aria-hidden /> 15+ SEO tools
            </Chip>
          )}
          {step === 2 && (
            <Chip className="top-[12%] right-[8%]">
              <GitHubMark className="size-3.5" /> MIT licensed
            </Chip>
          )}
          {step === 3 && (
            <Chip className="top-[14%] left-[4%]">
              <Mail className="size-3.5 text-accent-text" aria-hidden /> We read every message
            </Chip>
          )}
        </Art>
      </main>
    </div>
  );
}
