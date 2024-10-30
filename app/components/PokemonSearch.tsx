"use client"

import { useState } from 'react'

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
  const [pokemonName, setPokemonName] = useState('')
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPokemonName(event.target.value)
    if (pokemonData) setPokemonData(null)
    if (error) setError(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setPokemonData(null)
    setIsLoading(true)

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim()}`
      )
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Pokemon "${pokemonName}" not found`)
        }
        throw new Error(`Failed to fetch Pokemon data (Status: ${response.status})`)
      }
      
      const data: Pokemon = await response.json()
      setPokemonData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Pokemon Search</h1>
      
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

      {error && (
        <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {pokemonData && (
        <div className="w-full max-w-md border rounded-lg shadow-lg p-6 bg-white">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2 capitalize">
              {pokemonData.name}
            </h2>
            
            <div className="relative w-48 h-48">
              <img 
                src={pokemonData.sprites.front_default} 
                alt={pokemonData.name}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
            </div>

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

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-600">Height</p>
                <p className="font-medium">{(pokemonData.height / 10).toFixed(1)}m</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Weight</p>
                <p className="font-medium">{(pokemonData.weight / 10).toFixed(1)}kg</p>
              </div>
            </div>

            <div className="w-full mt-4">
              <h3 className="text-lg font-medium mb-2">Base Stats</h3>
              <div className="space-y-2">
                {pokemonData.stats.map(({ stat, base_stat }) => (
                  <div key={stat.name} className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {stat.name.replace('-', ' ')}
                      </span>
                      <span className="text-sm font-medium">{base_stat}</span>
                    </div>
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