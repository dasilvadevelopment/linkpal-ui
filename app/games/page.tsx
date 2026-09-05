import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };
type Region = { id: number; api_id: number; name: string; display_name: string; main_generation: Generation | null };
type Version = { id: number; api_id: number; name: string; display_name: string };

type VersionGroupListItem = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  order: number;
  generation: Generation | null;
  regions: Region[];
  versions: Version[];
};

type VersionGroupListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: VersionGroupListItem[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { offset } = await searchParams;
  const res = await django(`/version-groups/?offset=${typeof offset === "string" ? offset : "0"}`);
  const data: VersionGroupListResponse = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
