import { django } from "@/lib/django";

type Generation = { id: number; api_id: number; name: string; display_name: string; main_region: string };
type TypeMini = { id: number; api_id: number; name: string; display_name: string };
type TypeRelations = { double: TypeMini[]; half: TypeMini[]; none: TypeMini[] };

type TypeListItem = {
  id: number;
  api_id: number;
  name: string;
  display_name: string;
  generation: Generation | null;
  attack_relations: TypeRelations;
  defense_relations: TypeRelations;
};

type TypeListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TypeListItem[];
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { offset } = await searchParams;
  const res = await django(`/types/?offset=${typeof offset === "string" ? offset : "0"}`);
  const data: TypeListResponse = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
