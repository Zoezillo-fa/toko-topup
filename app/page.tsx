// app/page.tsx

import { Navbar } from "@/components/Navbar";
import { GameGrid } from "@/components/GameGrid";
import { supabase } from "@/lib/supabaseClient";

// Fungsi untuk mengambil data semua game dari Supabase
async function getGames() {
  const { data, error } = await supabase
    .from('games') // dari tabel 'games'
    .select('slug, name, image_url'); // pilih kolom yang dibutuhkan

  if (error) {
    console.error('Error fetching games:', error);
    return [];
  }

  return data;
}

// Halaman ini menjadi 'async' karena kita mengambil data
export default async function HomePage() {
  const games = await getGames();

  return (
    <main className="bg-gray-900 min-h-screen">
      <Navbar />

      {/* Kirim data 'games' yang sudah diambil ke komponen GameGrid */}
      <GameGrid games={games} />

    </main>
  );
}