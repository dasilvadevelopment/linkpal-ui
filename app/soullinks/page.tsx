import { django } from "@/lib/django";
import Link from "next/link";



export default async function SoullinkPage() {
  const res = await django("/soullinks/");

  if (!res.ok) return <p>couldn't load soullinks ({res.status})</p>

  const { results: soullinks } = await res.json();

  return (
    <ul>
      {soullinks.map((soullink: { id: number; name: string }) => (
        <Link key={soullink.id} href={`/soullinks/${soullink.id}`}>
          <li>
            {soullink.name}
          </li>
        </Link>
      ))}
    </ul>
  )
}