import { useState, useEffect } from 'react';
import { getPhantomWallet, walletDebugger } from '../src/walletIntegration';

export default function WalletConnectButton({ onConnect, onDisconnect }) {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  useEffect(() => {
    // Check if Phantom is installed
    const checkPhantomInstallation = () => {
      const isInstalled = walletDebugger.checkPhantomInstallation();
      setIsPhantomInstalled(isInstalled);
      
      // If wallet is already connected, update state
      const wallet = getPhantomWallet();
      if (wallet.connected) {
        setIsConnected(true);
        setPublicKey(wallet.publicKey?.toString());
        if (onConnect) onConnect(wallet.publicKey);
      }
    };
    
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      checkPhantomInstallation();
    }
    
    // Clean up
    return () => {
      // Any cleanup if needed
    };
  }, [onConnect]);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const wallet = getPhantomWallet();
      const publicKey = await wallet.connect();
      
      setIsConnected(true);
      setPublicKey(publicKey.toString());
      
      // Log connection status for debugging
      walletDebugger.logConnectionStatus(wallet);
      
      if (onConnect) onConnect(publicKey);
      
      console.log('Wallet connected successfully');
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setIsLoading(true);
      
      const wallet = getPhantomWallet();
      await wallet.disconnect();
      
      setIsConnected(false);
      setPublicKey(null);
      
      if (onDisconnect) onDisconnect();
      
      console.log('Wallet disconnected successfully');
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
      setError('Failed to disconnect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPhantomInstalled) {
    return (
      <button 
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
        onClick={() => window.open('https://phantom.app/', '_blank')}
      >
        Install Phantom
      </button>
    );
  }

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      
      <button
        className={`${
          isConnected 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center`}
        onClick={isConnected ? disconnectWallet : connectWallet}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="inline-block animate-spin mr-2">⟳</span>
        ) : null}
        
        {isConnected 
          ? `Connected: ${publicKey?.slice(0, 4)}...${publicKey?.slice(-4)}` 
          : 'Connect Wallet'}
      </button>
    </div>
  );
}
