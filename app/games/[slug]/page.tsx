import { notFound } from "next/navigation";
import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };
type Region = { id: number; api_id: number; name: string; display_name: string; main_generation: Generation | null };
type Version = { id: number; api_id: number; name: string; display_name: string };

type VersionGroupDetail = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  order: number;
  generation: Generation | null;
  regions: Region[];
  versions: Version[];
};

type LocationListItem = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  region: Region | null;
  sort_order: number;
};

type LocationListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: LocationListItem[];
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [detailRes, locationsRes] = await Promise.all([
    django(`/version-groups/${slug}/`),
    django(`/version-groups/${slug}/locations/`),
  ]);

  if (detailRes.status === 404) notFound();

  const game: VersionGroupDetail = await detailRes.json();
  const locations: LocationListResponse = await locationsRes.json();

  return <pre>{JSON.stringify({ game, locations }, null, 2)}</pre>;
}
