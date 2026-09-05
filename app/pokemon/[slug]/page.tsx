import { notFound } from "next/navigation";
import { django } from "@/lib/django";

type TypeSlot = { slot: number; type: { id: number; api_id: number; name: string; display_name: string } };
type AbilitySlot = {
  slot: number;
  is_hidden: boolean;
  ability: { id: number; api_id: number; name: string; display_name: string; short_effect: string };
};

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

type PokemonDetail = {
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
  height: number;
  weight: number;
  base_experience: number | null;
  order: number;
  is_default: boolean;
  sprite_shiny: string;
  sprite_home: string;
  cry_latest: string;
  ev_yield: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
  abilities: AbilitySlot[];
  species: SpeciesListItem | null;
};

type Matchups = Record<string, number>;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [detailRes, matchupsRes] = await Promise.all([
    django(`/pokemon/${slug}/`),
    django(`/pokemon/${slug}/matchups/`),
  ]);

  if (detailRes.status === 404) notFound();

  const pokemon: PokemonDetail = await detailRes.json();
  const matchups: Matchups = await matchupsRes.json();

  return <pre>{JSON.stringify({ pokemon, matchups }, null, 2)}</pre>;
}
