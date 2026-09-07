import { django } from "@/lib/django";
import { notFound } from "next/navigation";

type Member = {
  id: number;
  pokemon_detail: { display_name: string, sprite_default: string };
  primary_type: { display_name: string };
  participant_detail: { display_name: string };
};

type Pair = {
  id: number;
  status: string;
  location: { display_name: string };
  members: Member[];
};

const TYPE_COLOR: Record<string, string> = {
  normal: "#9098A1", fire: "#E8623A", water: "#4E86D6", electric: "#D9A61E",
  grass: "#5AA84E", ice: "#5FBFC4", fighting: "#B8412F", poison: "#8B4A9E",
  ground: "#B78A3F", flying: "#7B8FD4", psychic: "#DE5C82", bug: "#7B9A22",
  rock: "#A08D50", ghost: "#5F5A8E", dragon: "#5B54C4", dark: "#5A4E48",
  steel: "#7D8B96", fairy: "#D77BA6",
};

export default async function SoullinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [res, pairs] = await Promise.all([
    django(`/soullinks/${id}/`),
    django(`/soullinks/${id}/pairs/`),
  ]);

  const pokemon = await django(`/pokemon/`);

  if (res.status === 404) notFound();

  if (!res.ok) return <p>Couldn't fetch soullink details: ({res.status})</p>;
  if (!pairs.ok) return <p>Couldn't fetch soullink details: ({pairs.status})</p>;
  if (!pokemon.ok) return <p>Couldn't fetch soullink details: ({pokemon.status})</p>;

  const LinkDetails = await res.json();
  const { results: PairDetails } = await pairs.json();
  const { results: PokemonDetails } = await pokemon.json();


  return (
    <>
      <h1 className="text-center text-6xl my-5">{LinkDetails.name}</h1>

      <div className="grid gap-5 justify-center grid-cols-[repeat(auto-fill,minmax(200px,200px))]">
        {PairDetails.map((pair: Pair) => (
          <div key={pair.id} className="pair border mb-2"
            style={{
              background:
                `linear-gradient(105deg, ${TYPE_COLOR[pair.members[0]?.primary_type.display_name.toLowerCase()] ?? "#888"} 50%, 
                ${TYPE_COLOR[pair.members[1]?.primary_type.display_name.toLowerCase()] ?? "#888"} 50%)`
            }}>
            {pair.members.map((member: Member) => (
              <div
                key={member.id}
                className="member flex items-center justify-center">
                <img src={`${member.pokemon_detail.sprite_default}`} alt="" />
              </div>
            ))}

          </div>
        ))}
      </div>
    </>
  )
}