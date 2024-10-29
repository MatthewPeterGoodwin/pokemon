"use client"

import { useState, useEffect } from 'react'

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
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
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        // Fetch initial pagination data
        const paginationResponse = await fetch('https://pokeapi.co/api/v2/pokemon/');
        if (!paginationResponse.ok) {
          throw new Error(`HTTP error: Status ${paginationResponse.status}`);
        }
        
        const paginationData: PaginationResponse = await paginationResponse.json();
        
        // Fetch individual Pokemon data in parallel
        const pokemonPromises = paginationData.results.map(pokemon => 
          fetch(pokemon.url).then(res => {
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
  }, []);

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
            className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <img
              className="h-40 w-full max-w-full rounded-lg object-contain"
              src={pokemon.sprites.front_default}
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
    </div>
  );
}