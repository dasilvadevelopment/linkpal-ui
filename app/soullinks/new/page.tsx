"use client";

import { useEffect, useState } from "react";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };
type Region = { id: number; api_id: number; name: string; display_name: string; main_generation: Generation | null };
type Version = { id: number; api_id: number; name: string; display_name: string };

type VersionGroupListItem = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  order: number;
  generation: Generation | null;
  regions: Region[];
  versions: Version[];
};

type VersionGroupListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: VersionGroupListItem[];
};

// django() can't run in a client component (it reads cookies() from
// next/headers), and there's no Next route handler proxying this public,
// unauthenticated pokedex endpoint -- so this fetches Django directly.
const DJANGO_URL = "http://127.0.0.1:8000/api";

export default function Page() {
  const [versionGroups, setVersionGroups] = useState<VersionGroupListResponse | null>(null);

  useEffect(() => {
    fetch(`${DJANGO_URL}/version-groups/`)
      .then((res) => res.json())
      .then(setVersionGroups);
  }, []);

  return <pre>{JSON.stringify(versionGroups, null, 2)}</pre>;
}
