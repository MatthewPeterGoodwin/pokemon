import PokemonSearch from "./components/PokemonSearch";
import PokemonGallery from "./components/PokemonGallery";
import PokemonHeader from "./components/PokemonHeader";

export default function Home() {
  return (
    <>
      <PokemonHeader />
      <PokemonSearch />
      <PokemonGallery />
    </>
  )
}; 
