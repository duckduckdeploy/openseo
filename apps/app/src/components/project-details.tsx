"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LocationPicker, type LocationChoice } from "@/components/location-picker";
import { Button, Card, CardHeader, ErrorNote, Field, Input } from "@/components/ui";
import { api } from "@/lib/api";
import type { Project } from "@/lib/hooks";

/** Name, website, default market and language of a project. */
export function ProjectDetails({ project }: { project: Project }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(project.name);
  const [domain, setDomain] = useState(project.domain ?? "");
  const [language, setLanguage] = useState(project.language);
  // No country here: unless a market is picked, the API works it out from the code, which also
  // repairs projects created before the country was stored correctly.
  const [location, setLocation] = useState<LocationChoice>({ code: project.locationCode, name: project.locationName });
  const save = useMutation({
    mutationFn: () =>
      api<Project>(`/projects/${project.id}`, {
        method: "PATCH",
        body: {
          name: name.trim(),
          domain: domain.trim() || null,
          language: language.trim(),
          locationCode: location.code,
          locationName: location.name,
          ...(location.country ? { country: location.country.toLowerCase() } : {}),
        },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <Card>
      <CardHeader
        title="Project details"
        description={
          <>
            Default market {project.locationName.replaceAll(",", ", ")} · data country <span className="font-mono uppercase">{project.country}</span> · language{" "}
            <span className="font-mono uppercase">{project.language}</span>
          </>
        }
      />
      <form
        className="grid gap-4 p-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        <Field label="Project name">
          <Input value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} />
        </Field>
        <Field label="Website" hint="Default for audits, rankings, backlinks and competitors.">
          <Input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="acme.com" maxLength={253} />
        </Field>
        <Field label="Default market" hint="Country used for keyword data, trends, domain distribution and Maps.">
          <LocationPicker value={location} onChange={setLocation} countriesOnly />
        </Field>
        <Field label="Language" hint="Language code, for example en or de.">
          <Input value={language} onChange={(event) => setLanguage(event.target.value)} required minLength={2} maxLength={10} />
        </Field>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <Button type="submit" variant="primary" loading={save.isPending} disabled={!name.trim() || language.trim().length < 2}>
            Save settings
          </Button>
          <span className="text-xs text-muted">Cached lookups for the old market are not reused.</span>
          {save.isSuccess && (
            <span role="status" className="text-[13px] text-pos">
              Saved
            </span>
          )}
        </div>
        <div className="sm:col-span-2">
          <ErrorNote error={save.error} />
        </div>
      </form>
    </Card>
  );
}
