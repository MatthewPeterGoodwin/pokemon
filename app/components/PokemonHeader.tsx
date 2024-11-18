import Link from 'next/link';

export default function PokemonHeader() {
    return (
        <header className="bg-blue-600 p-4 shadow-md">
            <h1 className="text-white text-3xl font-bold text-center mb-4">
                Pokémon
            </h1>
            <nav className="flex justify-center space-x-6">
                <Link href="/" className="text-white hover:text-yellow-300 transition-colors duration-200">
                    Home
                </Link>
                <Link href="/search" className="text-white hover:text-yellow-300 transition-colors duration-200">
                    Search
                </Link>
                <Link href="/random" className="text-white hover:text-yellow-300 transition-colors duration-200">
                    Random
                </Link>
                <Link href="/gallery" className="text-white hover:text-yellow-300 transition-colors duration-200">
                    Gallery
                </Link>
            </nav>
        </header>
    );
}
