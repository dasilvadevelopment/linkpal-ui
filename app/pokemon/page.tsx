import { django } from "@/lib/django";

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

type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { offset } = await searchParams;
  const res = await django(`/pokemon/?offset=${typeof offset === "string" ? offset : "0"}`);
  const data: PokemonListResponse = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
