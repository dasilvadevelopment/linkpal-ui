import { django } from "@/lib/django";
import { notFound } from "next/navigation";

type Member = {
  id: number;
  pokemon_detail: { display_name: string };
  primary_type: { display_name: string };
  participant_detail: { display_name: string };
};

type Pair = {
  id: number;
  status: string;
  location: { display_name: string };
  members: Member[];
};

export default async function SoullinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await django(`/soullinks/${id}/`);
  const pairs = await django(`/soullinks/${id}/pairs/`);

  if (res.status === 404) notFound();
  if (!res.ok) return <p>Couldn't fetch soullink details: ({res.status})</p>;
  if (!pairs.ok) return <p>Couldn't fetch soullink details: ({pairs.status})</p>;

  const LinkDetails = await res.json();
  const { results: PairDetails } = await pairs.json();

  console.log(PairDetails);

  return (
    <>
      <h1>{LinkDetails.name}</h1>

      <div className="box grid grid-cols-5 gap-5">
        {PairDetails.map(( pair: Pair ) => (
          <div key={pair.id} className="pair border mb-2">
            {pair.members.map((member: Member, count) => (
              <div key={member.id} className="member">
                <div className={`name-${count}`}>{member.pokemon_detail.display_name}</div>
                <div className={`name-${count}`}>{member.primary_type.display_name}</div>
             </div>
           ))}
            
          </div>
        ))}
      </div>
    </>
  )
}