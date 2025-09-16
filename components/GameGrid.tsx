// components/GameGrid.tsx

import { GameCard } from './GameCard';

// Definisikan tipe data untuk sebuah game
interface Game {
  slug: string;
  name: string;
  image_url: string;
}

// Komponen ini sekarang menerima 'games' sebagai properti
export const GameGrid = ({ games }: { games: Game[] }) => {
  return (
    <div className="bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Pilihan Game Populer</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {games.map((game) => (
            // Gunakan properti 'slug' untuk link
            <GameCard key={game.slug} id={game.slug} name={game.name} imageUrl={game.image_url} />
          ))}
        </div>
      </div>
    </div>
  );
};