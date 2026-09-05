import { django } from "@/lib/django";

type VersionGroupMini = { id: number; api_id: number; name: string; display_name: string };

type SoulLinkListItem = {
  id: number;
  name: string;
  version_group: VersionGroupMini;
  player_count: number;
  status: string;
  participant_count: number;
  pair_count: number;
  team_count: number;
  created_at: string;
};

type SoulLinkListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: SoulLinkListItem[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { offset } = await searchParams;
  const res = await django(`/soullinks/?offset=${typeof offset === "string" ? offset : "0"}`);

  if (res.status === 401) {
    return <pre>401 Unauthorized -- not logged in.</pre>;
  }

  const data: SoulLinkListResponse = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
