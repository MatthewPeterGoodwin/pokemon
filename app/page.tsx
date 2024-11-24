import PokemonHeader from "./components/PokemonHeader";
import PokemonCard from "./components/PokemonCard";
import PokemonFooter from "./components/PokemonFooter";

export default function Home() {
  return (
    <>
      <PokemonHeader />
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <PokemonCard name="squirtle" className="flex-1 basis-80 min-w-0" />
          <PokemonCard name="wartortle" className="flex-1 basis-80 min-w-0" />
          <PokemonCard name="blastoise" className="flex-1 basis-80 min-w-0" />
        </div>
      </div>
      <PokemonFooter />
    </>
  )
}; 
