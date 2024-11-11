"use client";

import { useState, useEffect } from 'react';

// Types
interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

interface PaginationResponse {
  count: number;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export default function PokemonGallery() {
  // State variables
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Items per page for pagination
  const itemsPerPage = 12;

  // Fetches pokemon data for pagination, with calculated offset, based on the currentPage state variable
  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const paginationResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${itemsPerPage}`);
        
        if (!paginationResponse.ok) {
          throw new Error(`HTTP error: Status ${paginationResponse.status}`);
        }

        const paginationData: PaginationResponse = await paginationResponse.json();
        setTotalPages(Math.ceil(paginationData.count / itemsPerPage));

        const pokemonPromises = paginationData.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch ${pokemon.name}`);
            return res.json();
          })
        );

        const pokemonList = await Promise.all(pokemonPromises);
        setPokemonData(pokemonList);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [currentPage]);

  // Handles page change previous
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handles page change next
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  // Handles click of pokemon to turn to shiny, if the same Pokémon is clicked - deselect it
  const handlePokemonClick = (pokemon: Pokemon) => {
    if (selectedPokemon?.name === pokemon.name) {
      setSelectedPokemon(null);
    } else {
      setSelectedPokemon(pokemon);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Loading Pokemon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {pokemonData.map((pokemon) => (
          <div 
            key={pokemon.name}
            className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handlePokemonClick(pokemon)}
          >
            <img
              className="h-40 w-full max-w-full rounded-lg object-contain"
              src={selectedPokemon?.name === pokemon.name ? pokemon.sprites.front_shiny : pokemon.sprites.front_default} // Show shiny if selected
              alt={`${pokemon.name} sprite`}
            />
            <h2 className="mt-2 text-center capitalize font-medium">
              {pokemon.name}
            </h2>
            <div className="mt-2 flex gap-2 justify-center">
              {pokemon.types.map(({ type }) => (
                <span 
                  key={type.name}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm capitalize"
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
