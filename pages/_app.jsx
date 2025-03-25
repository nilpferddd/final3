import React, { useEffect } from 'react';
import { initDebugTools, toggleDebugConsole } from '../src/debugUtils';
import WalletConnectButton from '../components/WalletConnectButton';
import TokenCreationForm from '../components/TokenCreationForm';
import LiquidityPoolForm from '../components/LiquidityPoolForm';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  // Initialize debug tools on component mount
  useEffect(() => {
    initDebugTools({ enabled: true, logLevel: 'debug' });
    
    // Add keyboard shortcut for debug console
    const handleKeyDown = (e) => {
      // Ctrl+Shift+D to toggle debug console
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        toggleDebugConsole();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">Solana Token Creator</h1>
          <WalletConnectButton />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>
      
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Solana Token Creator with Phantom Wallet Integration</p>
          <p className="text-sm mt-2">Press Ctrl+Shift+D to open debug console</p>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;
