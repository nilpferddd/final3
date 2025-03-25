import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavbarProps {
  walletConnected: boolean;
  onConnectWallet: () => void;
}

export default function Navbar({ walletConnected, onConnectWallet }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return router.pathname === path;
  };
  
  return (
    <nav className="bg-dark-blue shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-solana-green cursor-pointer">SolanaTokenCreator</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <span className={`${isActive('/') 
                  ? 'border-solana-purple text-white' 
                  : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                  Home
                </span>
              </Link>
              <Link href="/create-token">
                <span className={`${isActive('/create-token') 
                  ? 'border-solana-purple text-white' 
                  : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                  Token erstellen
                </span>
              </Link>
              <Link href="/liquidity-pool">
                <span className={`${isActive('/liquidity-pool') 
                  ? 'border-solana-purple text-white' 
                  : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                  Liquidity Pool
                </span>
              </Link>
              <Link href="/manage-liquidity">
                <span className={`${isActive('/manage-liquidity') 
                  ? 'border-solana-purple text-white' 
                  : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                  Liquidität verwalten
                </span>
              </Link>
              <Link href="/tokens">
                <span className={`${isActive('/tokens') 
                  ? 'border-solana-purple text-white' 
                  : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
                  Meine Tokens
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              className="bg-solana-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              onClick={onConnectWallet}
            >
              {walletConnected ? 'Wallet verbunden' : 'Wallet verbinden'}
            </button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Menü öffnen</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <span className={`${isActive('/') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} 
              block pl-3 pr-4 py-2 border-l-4 ${isActive('/') ? 'border-solana-purple' : 'border-transparent'} 
              text-base font-medium cursor-pointer`}>
              Home
            </span>
          </Link>
          <Link href="/create-token">
            <span className={`${isActive('/create-token') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} 
              block pl-3 pr-4 py-2 border-l-4 ${isActive('/create-token') ? 'border-solana-purple' : 'border-transparent'} 
              text-base font-medium cursor-pointer`}>
              Token erstellen
            </span>
          </Link>
          <Link href="/liquidity-pool">
            <span className={`${isActive('/liquidity-pool') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} 
              block pl-3 pr-4 py-2 border-l-4 ${isActive('/liquidity-pool') ? 'border-solana-purple' : 'border-transparent'} 
              text-base font-medium cursor-pointer`}>
              Liquidity Pool
            </span>
          </Link>
          <Link href="/manage-liquidity">
            <span className={`${isActive('/manage-liquidity') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} 
              block pl-3 pr-4 py-2 border-l-4 ${isActive('/manage-liquidity') ? 'border-solana-purple' : 'border-transparent'} 
              text-base font-medium cursor-pointer`}>
              Liquidität verwalten
            </span>
          </Link>
          <Link href="/tokens">
            <span className={`${isActive('/tokens') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'} 
              block pl-3 pr-4 py-2 border-l-4 ${isActive('/tokens') ? 'border-solana-purple' : 'border-transparent'} 
              text-base font-medium cursor-pointer`}>
              Meine Tokens
            </span>
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5">
            <button
              type="button"
              className="w-full bg-solana-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              onClick={onConnectWallet}
            >
              {walletConnected ? 'Wallet verbunden' : 'Wallet verbinden'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
