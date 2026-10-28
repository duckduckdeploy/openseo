"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plug, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SyncState } from "@/components/search/stored-keywords";
import { ConfirmDialog } from "@/components/tracking/kit";
import { Badge, Button, Card, CardHeader, ErrorNote, Field, Select } from "@/components/ui";
import { api, dateOnly } from "@/lib/api";
import { track } from "@/lib/analytics";

export type Provider = "gsc";
export type GoogleAccount = { id: string; provider: Provider; email: string | null; createdAt: string };
export type GoogleState = {
  configured: boolean;
  redirectUris: Record<Provider, string>;
  gsc: { siteUrl: string; accountId: string; email: string | null; canWrite: boolean; sync: SyncState; createdAt: string } | null;
  accounts: GoogleAccount[];
};

export const PRODUCT: Record<Provider, string> = { gsc: "Google Search Console" };
export const LINK_ERRORS: Record<string, string> = {
  state_mismatch: "The connection link expired or was opened in another session. Try again from this page.",
  access_denied: "Google access was not granted.",
  scope_denied: "A permission was unticked on Google's consent screen, so nothing was connected. Try again and leave the boxes ticked.",
  token_exchange_failed: "Google did not accept the sign-in. Check that the OAuth client's redirect URIs match this server, then try again.",
  invalid_id_token: "Google's reply could not be verified. Check GOOGLE_CLIENT_ID, then try again.",
  signed_out: "You were signed out. Sign in and try again.",
  failed: "Connecting failed. Try again.",
};

export const connectUrl = (provider: Provider, returnTo: string) => `/api/google/${provider}/connect?returnTo=${encodeURIComponent(returnTo)}`;
export const projectSettingsHref = (projectId: string) => `/p/${projectId}/settings`;

/** A Search Console property as a plain domain: "sc-domain:acme.com" and "https://www.acme.com/" read as acme.com and www.acme.com. */
export function propertyLabel(siteUrl: string) {
  if (siteUrl.startsWith("sc-domain:")) return siteUrl.slice("sc-domain:".length);
  try {
    const url = new URL(siteUrl);
    return `${url.host}${url.pathname}`.replace(/\/$/, "");
  } catch {
    return siteUrl;
  }
}

export function useGoogleState(projectId: string) {
  return useQuery({ queryKey: ["google", projectId], queryFn: () => api<GoogleState>(`/projects/${projectId}/google`) });
}

function PropertyPicker({ projectId, provider, accounts, onDone }: { projectId: string; provider: Provider; accounts: GoogleAccount[]; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [choice, setChoice] = useState("");
  const options = useQuery({
    queryKey: ["google-options", projectId, provider, accountId],
    queryFn: () =>
      api<{ siteUrl: string; verified: boolean }[]>(`/projects/${projectId}/google/${provider}/sites`, { query: { accountId } }).then((rows) => {
        // A domain property and a URL-prefix property for the same site would read the same.
        const labels = rows.map((r) => propertyLabel(r.siteUrl));
        return rows.map((r, i) => ({
          id: r.siteUrl,
          label: labels.indexOf(labels[i]!) !== labels.lastIndexOf(labels[i]!) && !r.siteUrl.startsWith("sc-domain:") ? `${labels[i]} (URL prefix)` : labels[i]!,
          disabled: !r.verified,
        }));
      }),
    enabled: Boolean(accountId),
  });
  const save = useMutation({
    mutationFn: () => api(`/projects/${projectId}/google/${provider}`, { method: "PUT", body: { accountId, siteUrl: choice } }),
    onSuccess: () => {
      track("search_console_property_selected", { project_id: projectId });
      void queryClient.invalidateQueries({ queryKey: ["google", projectId] });
      void queryClient.invalidateQueries({ queryKey: ["search", projectId] });
      onDone();
    },
  });
  return (
    <form
      className="grid gap-3 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (choice) save.mutate();
      }}
    >
      <Field label="Google account">
        <Select
          value={accountId}
          onChange={(event) => {
            setAccountId(event.target.value);
            setChoice("");
          }}
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.email ?? account.id}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Property" hint="Properties without verified access are listed but cannot be chosen.">
        <Select value={choice} onChange={(event) => setChoice(event.target.value)} disabled={!options.data?.length}>
          <option value="">{options.isPending ? "Loading…" : options.data?.length ? "Choose…" : "None in this account"}</option>
          {options.data?.map((option) => (
            <option key={option.id} value={option.id} disabled={option.disabled}>
              {option.label}
              {option.disabled ? " (no verified access)" : ""}
            </option>
          ))}
        </Select>
      </Field>
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Button type="submit" variant="primary" disabled={!choice} loading={save.isPending}>
          Use this property
        </Button>
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
      <div className="sm:col-span-2">
        <ErrorNote error={options.error ?? save.error} />
      </div>
    </form>
  );
}

export function ProviderCard({ projectId, provider, state }: { projectId: string; provider: Provider; state: GoogleState }) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [picking, setPicking] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const connection = state[provider];
  const accounts = state.accounts.filter((a) => a.provider === provider);
  const disconnect = useMutation({
    mutationFn: () => api(`/projects/${projectId}/google/${provider}`, { method: "DELETE" }),
    onSuccess: () => {
      track("search_console_disconnected", { project_id: projectId });
      setConfirming(false);
      void queryClient.invalidateQueries({ queryKey: ["google", projectId] });
    },
  });
  const label = connection ? propertyLabel(connection.siteUrl) : null;

  return (
    <Card>
      <CardHeader
        title={PRODUCT[provider]}
        description="Clicks, impressions and positions from Google itself."
        action={<Badge tone={connection ? "pos" : "neutral"}>{connection ? "Connected" : "Not connected"}</Badge>}
      />
      <div className="space-y-3 p-4 text-[13px]">
        {connection && !picking && (
          <>
            <p>
              <span className="font-medium break-all">{label}</span>
              <span className="block text-xs text-muted">Read through {connection.email ?? "a Google account"}, since {dateOnly(connection.createdAt)}.</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setPicking(true)}>
                Change property
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirming(true)}>
                Disconnect from this project
              </Button>
            </div>
          </>
        )}
        {(!connection || picking) &&
          (accounts.length ? (
            <PropertyPicker projectId={projectId} provider={provider} accounts={accounts} onDone={() => setPicking(false)} />
          ) : (
            <p className="text-muted">No Google account connected for {PRODUCT[provider]} yet.</p>
          ))}
        <a
          href={connectUrl(provider, pathname)}
          onClick={() => track("google_connect_started", { project_id: projectId, provider })}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium underline underline-offset-2"
        >
          <Plug className="size-3.5" aria-hidden /> {accounts.length ? "Add another Google account" : "Connect a Google account"}
        </a>
      </div>
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => disconnect.mutate()}
        title={`Disconnect ${PRODUCT[provider]}?`}
        confirmLabel="Disconnect"
        danger
        pending={disconnect.isPending}
        error={disconnect.error}
      >
        <p>This project stops reading {label ?? "this property"} and its synced Search Console data is deleted. The Google account stays connected, so you can pick the property again later.</p>
      </ConfirmDialog>
    </Card>
  );
}

/** The Google accounts the user has connected, across projects. Hidden when there are none. */
export function GoogleAccountsCard() {
  const queryClient = useQueryClient();
  const accounts = useQuery({ queryKey: ["google", "accounts"], queryFn: () => api<GoogleAccount[]>("/google/accounts") });
  const [removing, setRemoving] = useState<GoogleAccount | null>(null);
  const remove = useMutation({
    mutationFn: (id: string) => api<{ projects: number }>(`/google/accounts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      track("google_account_removed");
      setRemoving(null);
      // Every project's connection state may have changed.
      void queryClient.invalidateQueries({ queryKey: ["google"] });
    },
  });
  if (!accounts.data?.length) return null;
  return (
    <Card>
      <CardHeader title="Google accounts" description="Google grants you have given OpenSEO. Removing one disconnects it from every project that uses it." />
      <ul className="divide-y divide-line">
        {accounts.data.map((account) => (
          <li key={account.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[13px]">
            <span>
              <span className="font-medium">{account.email ?? account.id}</span> <span className="text-muted">· {PRODUCT[account.provider]}</span>
            </span>
            <Button size="sm" variant="ghost" onClick={() => setRemoving(account)}>
              <Trash2 className="size-3.5" aria-hidden /> Remove
            </Button>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={() => removing && remove.mutate(removing.id)}
        title="Remove this Google account?"
        confirmLabel="Remove"
        danger
        pending={remove.isPending}
        error={remove.error}
      >
        <p>
          OpenSEO deletes its tokens for {removing?.email ?? "this account"} and disconnects it from every project that reads {removing ? PRODUCT[removing.provider] : ""} through it. To revoke
          access on Google&apos;s side too, visit your Google account&apos;s security settings.
        </p>
      </ConfirmDialog>
    </Card>
  );
}
