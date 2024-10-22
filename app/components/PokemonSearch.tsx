"use client"
import { useState } from 'react'

interface PokemonType {
    type: {
      name: string;
    };
  }

export default function PokemonSearch() {
    const [pokemonName, setPokemonName] = useState<string>('')
    const [pokemonData, setPokemonData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPokemonName(event.target.value)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)
        setPokemonData(null)
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
            if (!response.ok) {
                throw new Error('Pokémon not found')
            }
            const data = await response.json()
            setPokemonData(data)
        } catch (error) {
            setError((error as Error).message)
        }
    }

    return (
        <div className="text-2xl flex flex-col items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="mb-4">
            <label>
                <input
                    name="myInput"
                    value={pokemonName}
                    onChange={handleInputChange}
                    placeholder="Enter Pokémon name"
                    className="border border-gray-300 rounded p-2"
                />
            </label>
            <button type="submit" disabled={!pokemonName} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                Search
            </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {pokemonData && (
            <div className="text-2xl border-solid border-2 border-sky-500 p-4 flex flex-col items-center">
                <img src={pokemonData.sprites.front_default} alt={pokemonData.name} className="mb-4" />
                <h1 className="text-center">
                    {pokemonData.types.map((t: PokemonType) => {
                        return t.type.name + " ";
                    })}
                </h1>
            </div>
        )}
    </div>
    
    )
}