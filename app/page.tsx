import PokemonHeader from "./components/PokemonHeader";
import PokemonCard from "./components/PokemonCard";
import { StrictMode } from "react";

export default function Home() {
  return (
    <>
    <StrictMode>
      <PokemonHeader />
      <PokemonCard name = {"squirtle"}/>
      <PokemonCard name = {"blastoise"}/>
      </StrictMode>
    </>
  )
}; 
