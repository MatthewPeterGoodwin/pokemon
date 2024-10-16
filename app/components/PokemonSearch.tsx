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
        <div className="pokemonSearch">
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        name="myInput"
                        value={pokemonName}
                        onChange={handleInputChange}
                        placeholder="Enter Pokémon name"
                    />
                </label>
                <button type="submit">Search</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {pokemonData && (
                <div>
                    <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
                    <h1>
                        {pokemonData.types.map((t: PokemonType) => {
                            return t.type.name + " "
                        })}
                    </h1>
                </div>
            )}
        </div>
    )
}