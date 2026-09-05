import { notFound } from "next/navigation";
import { django } from "@/lib/django";

type VersionGroupMini = { id: number; api_id: number; name: string; display_name: string };
type TypeMini = { id: number; api_id: number; name: string; display_name: string };

type ParticipantUser = { id: number; username: string };
type Participant = {
  id: number;
  slot: number;
  display_name: string;
  user: ParticipantUser | null;
  is_claimed: boolean;
};

type TypeSlot = { slot: number; type: TypeMini };
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

type PairMember = {
  id: number;
  participant: number;
  participant_detail: Participant;
  pokemon: number;
  pokemon_detail: PokemonListItem;
  primary_type: TypeMini | null;
  nickname: string;
  caught_at_level: number | null;
};

type LinkPairLocation = { id: number; display_name: string; sort_order: number };

type LinkPair = {
  id: number;
  location: LinkPairLocation;
  status: string;
  team_slot: number | null;
  is_complete: boolean;
  is_static: boolean;
  members: PairMember[];
};

type Violation = {
  code: string;
  message: string;
  type: string;
  participant: string;
  conflicting_pair_id: number | null;
};

type BoxedPair = LinkPair & { eligibility: { eligible: boolean; violations: Violation[] } };

type PaginatedLinkPairs = { count: number; next: string | null; previous: string | null; results: LinkPair[] };
type PaginatedBoxedPairs = { count: number; next: string | null; previous: string | null; results: BoxedPair[] };

type SoulLinkDetail = {
  id: number;
  name: string;
  version_group: VersionGroupMini;
  player_count: number;
  status: string;
  participant_count: number;
  pair_count: number;
  team_count: number;
  created_at: string;
  team_size: number;
  type_scope: string;
  track_final_evolution_typing: boolean;
  invite_code?: string;
  participants: Participant[];
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [detailRes, teamRes, boxRes, graveyardRes] = await Promise.all([
    django(`/soullinks/${id}/`),
    django(`/soullinks/${id}/team/`),
    django(`/soullinks/${id}/box/`),
    django(`/soullinks/${id}/graveyard/`),
  ]);

  if (detailRes.status === 401) {
    return <pre>401 Unauthorized -- not logged in.</pre>;
  }
  if (detailRes.status === 404) notFound();

  const soullink: SoulLinkDetail = await detailRes.json();
  const team: LinkPair[] = await teamRes.json();
  const box: PaginatedBoxedPairs = await boxRes.json();
  const graveyard: PaginatedLinkPairs = await graveyardRes.json();

  return <pre>{JSON.stringify({ soullink, team, box, graveyard }, null, 2)}</pre>;
}
