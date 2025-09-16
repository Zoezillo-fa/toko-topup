// components/GameCard.tsx

import Image from 'next/image';
import Link from 'next/link';

// Menentukan tipe data untuk properti (props) yang akan diterima komponen ini
interface GameCardProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const GameCard = ({ id, name, imageUrl }: GameCardProps) => {
  return (
    <Link href={`/order/${id}`} className="block group">
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105">
        <Image
          src={imageUrl}
          alt={name}
          width={300}
          height={400}
          className="w-full h-48 object-cover" // Pastikan gambar mengisi ruang
        />
        <div className="p-4">
          <h3 className="text-white font-bold text-lg truncate">{name}</h3>
        </div>
      </div>
    </Link>
  );
};