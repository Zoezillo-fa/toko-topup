// components/Navbar.tsx

import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Website */}
        <Link href="/" className="text-2xl font-bold text-white lg:text-3xl hover:text-gray-300">
          TOPUPKU
        </Link>
        
        {/* Menu Navigasi */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Home
          </Link>
          <Link href="/cek-pesanan" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Cek Pesanan
          </Link>
        </div>
      </div>
    </nav>
  );
};