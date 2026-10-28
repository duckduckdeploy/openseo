"use client";

import { ExternalLink } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProjectDetails } from "@/components/project-details";
import { connectUrl, GoogleAccountsCard, LINK_ERRORS, PRODUCT, type Provider, ProviderCard, useGoogleState } from "@/components/google/connection";
import { Note } from "@/components/tracking/kit";
import { EmptyState, ErrorNote, PageHeader, Spinner } from "@/components/ui";
import { useProject } from "@/lib/hooks";

function ProjectSettings() {
  const { projectId } = useParams<{ projectId: string }>();
  const params = useSearchParams();
  const google = useGoogleState(projectId);
  const project = useProject(projectId);
  const linkError = params.get("google_error");
  const linked = params.get("google_connected") as Provider | null;
  const state = google.data;

  return (
    <>
      <PageHeader title="Project settings" description="The project's website and market, and the Google connection it reads from." />
      <div className="space-y-6">
        {project.data && <ProjectDetails key={`${project.data.id}:${project.data.locationCode}:${project.data.country}`} project={project.data} />}
        <ErrorNote error={project.error} />
        {linkError && <ErrorNote error={new Error(LINK_ERRORS[linkError] ?? "Connecting Google failed. Try again.")} />}
        {linked && PRODUCT[linked] && <Note>Google account connected for {PRODUCT[linked]}. Choose the property this project should read.</Note>}
        {google.isPending && <Spinner />}
        <ErrorNote error={google.error} />
        {state && !state.configured && (
          <EmptyState title="Google is not set up on this server">
            Whoever runs this OpenSEO needs a Google OAuth client: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, with this redirect URI: {state.redirectUris.gsc}. The self-hosting docs walk through it.
          </EmptyState>
        )}
        {state?.configured && (
          <>
            <ProviderCard projectId={projectId} provider="gsc" state={state} />
            {state.gsc && !state.gsc.canWrite && (
              <Note>
                This Search Console connection is read-only, from before OpenSEO could submit sitemaps. Everything works; to let the Indexing page submit sitemaps to Google,{" "}
                <a href={connectUrl("gsc", `/p/${projectId}/settings`)} className="font-medium underline underline-offset-2">
                  reconnect Search Console
                </a>{" "}
                and allow full access.
              </Note>
            )}
            <GoogleAccountsCard />
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <ExternalLink className="size-3.5" aria-hidden />
              Search Console data is synced into this project daily (up to 16 months back) so keyword suggestions, rank tracking and indexing can use it. Disconnecting deletes it.
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default function ProjectSettingsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ProjectSettings />
    </Suspense>
  );
}
