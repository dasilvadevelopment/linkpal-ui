import { notFound } from "next/navigation";
import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };
type Region = { id: number; api_id: number; name: string; display_name: string; main_generation: Generation | null };
type VersionGroupMini = { id: number; api_id: number; name: string; display_name: string };
type LocationArea = { id: number; name: string; display_name: string };

type LocationDetail = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  region: Region | null;
  sort_order: number;
  generation: Generation | null;
  version_groups: VersionGroupMini[];
  is_manual: boolean;
  areas: LocationArea[];
};

type TypeSlot = { slot: number; type: { id: number; api_id: number; name: string; display_name: string } };
type PokemonListItem = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  sprite_default: string;
  sprite_official_artwork: string;
  types: TypeSlot[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  base_stat_total: number;
};
type VersionMini = { id: number; api_id: number; name: string; display_name: string };

type Encounter = {
  id: number;
  pokemon: PokemonListItem;
  version: VersionMini;
  method: string;
  min_level: number;
  max_level: number;
  chance: number;
  location_area: { id: number; name: string };
};

type EncounterListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Encounter[];
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [detailRes, encountersRes] = await Promise.all([
    django(`/locations/${slug}/`),
    django(`/locations/${slug}/encounters/`),
  ]);

  if (detailRes.status === 404) notFound();

  const location: LocationDetail = await detailRes.json();
  const encounters: EncounterListResponse = await encountersRes.json();

  return <pre>{JSON.stringify({ location, encounters }, null, 2)}</pre>;
}
