import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };

type SpeciesListItem = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  genus: string;
  generation: Generation | null;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
};

type SpeciesListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: SpeciesListItem[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { offset } = await searchParams;
  const res = await django(`/species/?offset=${typeof offset === "string" ? offset : "0"}`);
  const data: SpeciesListResponse = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
