import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };
type TypeMini = { id: number; api_id: number; name: string; display_name: string };

type MoveListItem = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  generation: Generation | null;
  type: TypeMini | null;
  damage_class: string;
  power: number | null;
  pp: number | null;
  accuracy: number | null;
  priority: number;
  effect_chance: number | null;
  target: string;
  short_effect: string;
  effect: string;
  flavor_text: string;
  ailment: string;
  ailment_chance: number | null;
  crit_rate: number;
  drain: number;
  healing: number;
  flinch_chance: number | null;
  stat_chance: number | null;
  min_hits: number | null;
  max_hits: number | null;
  min_turns: number | null;
  max_turns: number | null;
  learned_by_count: number;
};

type MoveListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: MoveListItem[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { offset } = await searchParams;
  const res = await django(`/moves/?offset=${typeof offset === "string" ? offset : "0"}`);
  const data: MoveListResponse = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
