"use client" // Marks this as a client-side component in Next.js
import { useState, useEffect } from 'react';
import { cn } from "../lib/utils"; // Utility for merging Tailwind classes

// Props interface defines what props the component accepts
interface Props {
    name: string;        // Required: Pokemon name to fetch
    className?: string;  // Optional: Custom CSS classes
}

// Pokemon interface defines the shape of data from the PokeAPI
interface Pokemon {
    name: string;
    sprites: {
        front_default: string;    // URL for front sprite
        back_default: string;     // URL for back sprite
    };
    types: Array<{               // Pokemon types (e.g., fire, water)
        type: {
            name: string;
        };
    }>;
    stats: Array<{              // Base stats (e.g., HP, Attack)
        base_stat: number;
        stat: {
            name: string;
        };
    }>;
    height: number;
    weight: number;
}

export default function PokemonCards({ name, className }: Props) {
    // State for storing Pokemon data and any error messages
    const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
    const [error, setError] = useState<string | null>(null);

    // useEffect hook to fetch Pokemon data when name changes
    useEffect(() => {
        const fetchPokemonData = async () => {
            try {
                // Fetch data from PokeAPI
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`
                );

                // Handle errors
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Pokemon "${name}" not found`);
                    }
                    throw new Error(`Failed to fetch Pokemon data (Status: ${response.status})`);
                }

                // Parse JSON response and update state
                const data: Pokemon = await response.json();
                setPokemonData(data);
                setError(null);
            } catch (error) {
                // Handle any errors that occurred
                setPokemonData(null);
                setError(error instanceof Error ? error.message : 'An unexpected error occurred');
            }
        };

        fetchPokemonData();
    }, [name]); // Re-run when name prop changes

    return (
        // Main container that accepts custom classes
        <div className={cn("w-full", className)}>
            {/* Error Display */}
            {error && (
                <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}

            {/* Pokemon Card Display */}
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
                                <p className="font-medium">
                                    {(pokemonData.height / 10).toFixed(1)}m
                                </p>
                            </div>
                            {/* Weight Display */}
                            <div className="text-center">
                                <p className="text-gray-600">Weight</p>
                                <p className="font-medium">
                                    {(pokemonData.weight / 10).toFixed(1)}kg
                                </p>
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
                                            <span className="text-sm font-medium">
                                                {base_stat}
                                            </span>
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
    )};