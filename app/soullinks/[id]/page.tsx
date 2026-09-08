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

export const TYPE_COLOR: Record<string, string> = {
  bug: "#9f9f28",
  dark: "#4f4747",
  dragon: "#576fbc",
  electric: "#dfbc28",
  fairy: "#e18ce1",
  fighting: "#e49021",
  fire: "#e4613e",
  flying: "#74aad0",
  ghost: "#6f4570",
  grass: "#439837",
  ground: "#a4733c",
  ice: "#47c8c8",
  normal: "#828282",
  poison: "#9354cb",
  psychic: "#e96c8c",
  rock: "#a9a481",
  steel: "#77b2cb",
  water: "#3099e1",
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

  console.log(LinkDetails);


  return (
    <>
      <h1 className="text-center text-6xl my-5">{LinkDetails.name}</h1>

      <div className="grid gap-5 justify-center grid-cols-[repeat(auto-fill,minmax(200px,200px))]">
        {PairDetails.map((pair: Pair, count: number) => {
            return (
              <div key={pair.id} className="grid grid-cols-2 gap-1">
                {pair.members.map((member: Member, count) => (
                  <div key={member.id} className={`relative member-${count}`}                    
                    style={{
                      // backgroundImage: `url(/types/${member?.primary_type.display_name}.svg)`,
                      backgroundColor: TYPE_COLOR[member?.primary_type.display_name.toLowerCase()] ?? "#888"             
                    }} 
                  >
                    <img src={`${member.pokemon_detail.sprite_default}`} alt="" />
                    <img className="typing-img absolute" src={`/types/${member?.primary_type.display_name}.svg`} alt="" />
                  </div>
                ))}
              </div>
            )
        })}
      </div>
    </>
  )
}



        // {PairDetails.map((pair: Pair) => (
        //   <div key={pair.id} className="pair mb-2"
        //     style={{

        //     }}>
        //     <div className="ball-divider"></div>
        //       <div className="ball-top">
        //         <div className="left"
        //             style={{
        //               backgroundImage: `url(/types/${pair.members[0]?.primary_type.display_name}.svg)`,
        //               backgroundColor: TYPE_COLOR[pair.members[0]?.primary_type.display_name.toLowerCase()] ?? "#888"             
        //             }} 
        //         >
        //           <img src={`${pair.members[0]?.pokemon_detail.sprite_default}`} alt="" />
        //         </div>
        //         <div className="right"
        //             style={{
        //               backgroundImage: `url(/types/${pair.members[1]?.primary_type.display_name}.svg)`,
        //               backgroundColor: TYPE_COLOR[pair.members[1]?.primary_type.display_name.toLowerCase()] ?? "#888"             
        //             }}                 
        //         >
        //           <img src={`${pair.members[1]?.pokemon_detail.sprite_default}`} alt="" />
        //         </div>
        //     </div>
        //     <div className="ball-bottom"></div>
        //   </div>
        // ))}
            // {pair.members.map((member: Member, count) => {
            //   if (count == 0) {
            //     return (
            //       <div key={count}
            //         className="ball-top"
            //         style={{
            //           backgroundImage: `url(/types/${member.primary_type.display_name}.svg)`,
            //           backgroundColor: TYPE_COLOR[pair.members[0]?.primary_type.display_name.toLowerCase()] ?? "#888"             
            //         }} >
            //         <img src={`${member.pokemon_detail.sprite_default}`} alt="" />
            //       </div>
            //     )
            //   } else if (count == 1) {
            //     return (
            //       <div key={count} className="ball-bottom"
            //         style={{
            //           backgroundImage: `url(/types/${member.primary_type.display_name}.svg)`,
            //           backgroundColor: TYPE_COLOR[pair.members[1]?.primary_type.display_name.toLowerCase()] ?? "#888"             
            //         }} 
            //       >
            //         <img src={`${member.pokemon_detail.sprite_default}`} alt="" />
            //       </div>
            //     )
            //   }
            // })}