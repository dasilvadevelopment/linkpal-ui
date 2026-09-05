import { django } from "@/lib/django";

type TypeChart = Record<string, Record<string, number>>;

export default async function Page() {
  const res = await django(`/types/chart/`);
  const chart: TypeChart = await res.json();

  return <pre>{JSON.stringify(chart, null, 2)}</pre>;
}
