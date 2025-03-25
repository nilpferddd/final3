import { AppProps } from 'next/app';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { initDebugTools } from '../src/debugUtils';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize debug tools when the app loads
    initDebugTools();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar walletConnected={false} onConnectWallet={() => {}} />
      <main className="py-8">
        <Component {...pageProps} />
      </main>
      <footer className="bg-dark-blue py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SolanaTokenCreator. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;
