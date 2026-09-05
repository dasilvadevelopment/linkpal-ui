import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };
type Region = { id: number; api_id: number; name: string; display_name: string; main_generation: Generation | null };

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
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { offset } = await searchParams;
  const res = await django(`/locations/?offset=${typeof offset === "string" ? offset : "0"}`);
  const data: LocationListResponse = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
