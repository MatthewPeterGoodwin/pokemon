import PokemonHeader from "./components/PokemonHeader";
import PokemonCard from "./components/PokemonCard";

export default function Home() {
  return (
    <>
      <PokemonHeader />
      <PokemonCard name = {"squirtle"}/>
      <PokemonCard name = {"blastoise"}/>
    </>
  )
}; 
