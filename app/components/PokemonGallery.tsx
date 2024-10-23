"use client"
import { useState, useEffect } from 'react'

export default function PokemonGallery() {
    const [pokemonData, setPokemonData] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`)
                if (!response.ok) {
                    throw new Error(`HTTP error: Status ${response.status}`);
                }
                let data = await response.json();
                setPokemonData(data);
            } catch (err: any) {
                setError(err.message);
                setPokemonData(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])
    console.log(pokemonData);
    return (
        <div>
            {pokemonData && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {pokemonData.results.map((t: any) => {
                        <div>
                            <p>t[0].name</p>
                            {/* <img
                                className="h-40 w-full max-w-full rounded-lg object-cover object-center"
                                src={t.sprites.front_default}
                            /> */}
                        </div>
                    })}
                </div>
            )}
        </div>
    )
}