import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-solana-green mb-6">
              Erstelle Solana Tokens ohne Programmierung
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Einfache und benutzerfreundliche Plattform zum Erstellen von Solana-Tokens, Hinzufügen von Liquiditätspools und Verwalten deiner Kryptowährungen.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/create-token">
                <button className="btn-primary py-3 px-8 text-lg">Token erstellen</button>
              </Link>
              <Link href="/liquidity-pool">
                <button className="btn-secondary py-3 px-8 text-lg">Liquidität hinzufügen</button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-80 h-80">
              {/* Hier würde ein Bild oder eine Animation eingefügt werden */}
              <div className="w-full h-full bg-gradient-to-r from-solana-purple to-solana-green rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 md:py-20">
        <h2 className="text-3xl font-bold text-center text-solana-green mb-12">Funktionen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-solana-purple rounded-full flex items-center justify-center">
                <span className="text-3xl">💰</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Token-Erstellung</h3>
            <p className="text-gray-300">
              Erstelle deine eigenen Solana-Tokens mit benutzerdefinierten Namen, Symbolen, Dezimalstellen und Versorgung.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-solana-green rounded-full flex items-center justify-center">
                <span className="text-3xl">🌊</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Liquidity Pools</h3>
            <p className="text-gray-300">
              Erstelle und verwalte Liquidity Pools mit Raydium V3 CPMM für deine Tokens.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-light-blue rounded-full flex items-center justify-center">
                <span className="text-3xl">🔒</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Token-Verwaltung</h3>
            <p className="text-gray-300">
              Verwalte deine Tokens, füge Metadaten hinzu und widerrufe die Token-Autorität für mehr Sicherheit.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 md:py-20">
        <h2 className="text-3xl font-bold text-center text-solana-green mb-12">So funktioniert es</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-dark-blue rounded-full flex items-center justify-center border-2 border-solana-purple">
                <span className="text-xl font-bold text-white">1</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Wallet verbinden</h3>
            <p className="text-gray-300">
              Verbinde deine Solana-Wallet, um loszulegen.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-dark-blue rounded-full flex items-center justify-center border-2 border-solana-purple">
                <span className="text-xl font-bold text-white">2</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Token erstellen</h3>
            <p className="text-gray-300">
              Gib die Token-Details ein und erstelle deinen eigenen Token.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-dark-blue rounded-full flex items-center justify-center border-2 border-solana-purple">
                <span className="text-xl font-bold text-white">3</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Liquidität hinzufügen</h3>
            <p className="text-gray-300">
              Erstelle einen Liquidity Pool für deinen Token.
            </p>
          </div>
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-dark-blue rounded-full flex items-center justify-center border-2 border-solana-purple">
                <span className="text-xl font-bold text-white">4</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Verwalten</h3>
            <p className="text-gray-300">
              Verwalte deine Tokens und Liquidity Pools.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 md:py-20">
        <div className="bg-gradient-to-r from-solana-purple to-solana-green p-1 rounded-lg">
          <div className="bg-dark-blue rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Bereit, deinen eigenen Token zu erstellen?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Starte jetzt und erstelle deinen eigenen Solana-Token in wenigen Minuten.
            </p>
            <Link href="/create-token">
              <button className="btn-primary py-3 px-8 text-lg">Jetzt starten</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
