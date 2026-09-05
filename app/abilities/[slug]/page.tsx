import { notFound } from "next/navigation";
import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };

type AbilityDetail = {
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await django(`/abilities/${slug}/`);
  if (res.status === 404) notFound();

  const ability: AbilityDetail = await res.json();

  return <pre>{JSON.stringify(ability, null, 2)}</pre>;
}
