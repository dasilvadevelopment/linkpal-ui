import { notFound } from "next/navigation";
import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };
type EggGroup = { id: number; api_id: number; name: string; display_name: string };
type SpeciesMini = { id: number; api_id: number; name: string; display_name: string };

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

type EvolutionStep = {
  trigger: string;
  min_level: number | null;
  item: string;
  held_item: string;
  known_move: string;
  known_move_type: string;
  location: string;
  min_happiness: number | null;
  min_affection: number | null;
  min_beauty: number | null;
  time_of_day: string;
  gender: number | null;
  needs_overworld_rain: boolean;
  turn_upside_down: boolean;
  trade_species: string;
  party_species: string;
  party_type: string;
  relative_physical_stats: number | null;
};

type SpeciesDetail = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  genus: string;
  generation: Generation | null;
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  capture_rate: number;
  base_happiness: number | null;
  hatch_counter: number | null;
  gender_rate: number;
  growth_rate: string;
  color: string;
  shape: string;
  habitat: string;
  flavor_text: string;
  egg_groups: EggGroup[];
  evolves_from: SpeciesMini | null;
  evolves_to: SpeciesMini[];
  evolution_steps: EvolutionStep[];
  forms: PokemonListItem[];
};

type EvolutionNode = {
  species: {
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
  evolution_steps: EvolutionStep[];
  evolves_to: EvolutionNode[];
};

type EvolutionChain = {
  api_id: number | null;
  baby_trigger_item: string;
  chain: EvolutionNode[];
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [detailRes, evolutionRes] = await Promise.all([
    django(`/species/${slug}/`),
    django(`/species/${slug}/evolution/`),
  ]);

  if (detailRes.status === 404) notFound();

  const species: SpeciesDetail = await detailRes.json();
  const evolution: EvolutionChain = await evolutionRes.json();

  return <pre>{JSON.stringify({ species, evolution }, null, 2)}</pre>;
}
