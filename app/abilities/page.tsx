import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };

type AbilityListItem = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  generation: Generation | null;
  is_main_series: boolean;
  short_effect: string;
  effect: string;
  flavor_text: string;
  pokemon_count: number;
};

type AbilityListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AbilityListItem[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { offset } = await searchParams;
  const res = await django(`/abilities/?offset=${typeof offset === "string" ? offset : "0"}`);
  const data: AbilityListResponse = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
