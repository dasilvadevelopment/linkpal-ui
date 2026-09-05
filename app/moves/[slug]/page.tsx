import { notFound } from "next/navigation";
import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };
type TypeMini = { id: number; api_id: number; name: string; display_name: string };

type MoveDetail = {
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await django(`/moves/${slug}/`);
  if (res.status === 404) notFound();

  const move: MoveDetail = await res.json();

  return <pre>{JSON.stringify(move, null, 2)}</pre>;
}
