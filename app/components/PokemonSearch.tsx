"use client"

import { useState } from 'react'

// Pokemon interface defines the shape of data from the PokeAPI
interface Pokemon {
  name: string;
  sprites: {
    front_default: string
    back_default: string
  };
  types: Array<{
    type: {
      name: string
    };
  }>;
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    };
  }>;
  height: number
  weight: number
}

export default function PokemonSearch() {
  // State variables for managing component's data and UI state
  const [pokemonName, setPokemonName] = useState('')    // User input for Pokemon name
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null)  // Fetched Pokemon data
  const [error, setError] = useState<string | null>(null)  // Error message state
  const [isLoading, setIsLoading] = useState(false)  // Loading state during API fetch

  // Handle input changes in the search field
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update Pokemon name state and reset previous results
    setPokemonName(event.target.value)
    if (pokemonData) setPokemonData(null)
    if (error) setError(null)
  }

  // Handle form submission to fetch Pokemon data
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission behavior
    event.preventDefault()
    
    // Reset previous state before new search
    setError(null)
    setPokemonData(null)
    setIsLoading(true)

    try {
      // Fetch data from PokeAPI
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim()}`
      )

      // Handle potential errors in API response
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Pokemon "${pokemonName}" not found`)
        }
        throw new Error(`Failed to fetch Pokemon data (Status: ${response.status})`)
      }

      // Parse JSON response and update state
      const data: Pokemon = await response.json()
      setPokemonData(data)
    } catch (error) {
      // Handle any errors that occurred during fetch
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      // Ensure loading state is reset after fetch completes
      setIsLoading(false)
    }
  }

  return (
    // Main container for Pokemon search component
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Pokemon Search</h1>

      {/* Search form with input and submit button */}
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
        <div className="flex gap-2">
          <input
            name="pokemonName"
            value={pokemonName}
            onChange={handleInputChange}
            placeholder="Enter Pokemon name..."
            className="flex-1 border border-gray-300 rounded-lg p-3 text-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!pokemonName || isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error message display */}
      {error && (
        <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Pokemon card display */}
      {pokemonData && (
        <div className="w-full max-w-md border rounded-lg shadow-lg p-6 bg-white">
          <div className="flex flex-col items-center">
            {/* Pokemon Name */}
            <h2 className="text-2xl font-bold mb-2 capitalize">
              {pokemonData.name}
            </h2>

            {/* Pokemon Sprite */}
            <div className="relative w-48 h-48">
              <img
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
            </div>

            {/* Pokemon Types */}
            <div className="flex gap-2 mb-4">
              {pokemonData.types.map(({ type }) => (
                <span
                  key={type.name}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium capitalize"
                >
                  {type.name}
                </span>
              ))}
            </div>

            {/* Height and Weight */}
            <div className="w-full grid grid-cols-2 gap-4">
              {/* Height Display */}
              <div className="text-center">
                <p className="text-gray-600">Height</p>
                <p className="font-medium">{(pokemonData.height / 10).toFixed(1)}m</p>
              </div>
              {/* Weight Display */}
              <div className="text-center">
                <p className="text-gray-600">Weight</p>
                <p className="font-medium">{(pokemonData.weight / 10).toFixed(1)}kg</p>
              </div>
            </div>

            {/* Stats Display */}
            <div className="w-full mt-4">
              <h3 className="text-lg font-medium mb-2">Base Stats</h3>
              <div className="space-y-2">
                {pokemonData.stats.map(({ stat, base_stat }) => (
                  <div key={stat.name} className="w-full">
                    {/* Stat Name and Value */}
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {stat.name.replace('-', ' ')}
                      </span>
                      <span className="text-sm font-medium">{base_stat}</span>
                    </div>
                    {/* Stat Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(base_stat / 255) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}