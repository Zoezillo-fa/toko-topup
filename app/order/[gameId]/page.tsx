// app/order/[gameId]/page.tsx

"use client"; // Menandakan ini adalah Client Component

import { Navbar } from "@/components/Navbar";
import Image from 'next/image';
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";

// Mendefinisikan tipe data untuk kejelasan kode
interface Product {
  id: number;
  name: string;
  price: number;
}
interface Game {
  name: string;
  image_url: string;
  description: string;
  products: Product[];
}

// Komponen utama halaman order
export default function OrderPage() {
  const params = useParams(); // Hook untuk mendapatkan parameter dari URL
  const gameId = params.gameId as string; // Mengambil slug game, contoh: 'mobile-legends'

  // State untuk menyimpan data game dan status loading
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  // State untuk menyimpan input dari pengguna
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrdering, setIsOrdering] = useState(false); // State untuk loading saat order

  // useEffect untuk mengambil data game dari API saat komponen dimuat
  useEffect(() => {
    async function fetchGameDetails() {
      // Memastikan gameId ada sebelum fetch
      if (!gameId) return;

      try {
        const response = await fetch(`/api/get-game?slug=${gameId}`);
        if (!response.ok) {
          // Jika game tidak ditemukan di API, tampilkan halaman 404
          notFound();
          return;
        }
        const data = await response.json();
        setGame(data);
      } catch (error) {
        console.error("Gagal mengambil detail game:", error);
        notFound(); // Tampilkan 404 jika ada error jaringan
      } finally {
        setLoading(false); // Hentikan loading setelah selesai
      }
    }

    fetchGameDetails();
  }, [gameId]); // Efek ini akan berjalan lagi jika gameId berubah

  // Fungsi yang dijalankan saat tombol "Beli Sekarang" diklik
  const handleOrder = async () => {
    if (!userId || !selectedProduct) {
      alert('Harap isi User ID dan pilih produk terlebih dahulu!');
      return;
    }

    setIsOrdering(true); // Mulai loading
    const orderId = `TTP-${Date.now()}`;

    try {
      const response = await fetch('/api/create-tripay-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: selectedProduct.price,
          productName: `${game?.name} - ${selectedProduct.name}`,
          customerName: userId,
          // Anda bisa menambahkan customerEmail jika ada fieldnya
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(`Gagal membuat transaksi: ${data.error}`);
        return;
      }

      if (data.checkout_url) {
        // Arahkan pengguna ke halaman pembayaran Tripay
        window.location.href = data.checkout_url;
      } else {
        alert('URL pembayaran tidak ditemukan.');
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Gagal memproses pesanan. Silakan coba lagi.");
    } finally {
      setIsOrdering(false); // Hentikan loading setelah selesai
    }
  };

  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Tampilan saat data masih dimuat
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-xl">
        Loading Game Details...
      </div>
    );
  }

  // Jika game tidak ditemukan setelah loading selesai
  if (!game) {
    return notFound();
  }

  // Tampilan utama halaman
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolom 1: Detail Game (sticky) */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg md:sticky md:top-8">
              <Image
                src={game.image_url}
                alt={game.name}
                width={400}
                height={500}
                className="rounded-lg w-full"
                priority
              />
              <h1 className="text-3xl font-bold mt-4">{game.name}</h1>
              <p className="text-gray-400 mt-2 text-sm">{game.description}</p>
            </div>
          </div>

          {/* Kolom 2: Form & Pilihan Produk */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
              <h2 className="text-xl font-semibold border-l-4 border-cyan-400 pl-4 mb-4">
                1. Masukkan User ID
              </h2>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <input
                  type="text"
                  placeholder="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Server (Opsional)"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold border-l-4 border-cyan-400 pl-4 mb-4">
                2. Pilih Nominal
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {game.products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`bg-gray-700 text-left p-4 rounded-lg border-2 transition-all duration-200 ${selectedProduct?.id === product.id ? 'border-cyan-500 bg-cyan-900 ring-2 ring-cyan-500' : 'border-transparent hover:border-cyan-500'}`}
                  >
                    <span className="font-semibold block">{product.name}</span>
                    <span className="text-gray-300 text-sm">{formatRupiah(product.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleOrder}
                disabled={isOrdering}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isOrdering ? 'Memproses...' : 'Beli Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}