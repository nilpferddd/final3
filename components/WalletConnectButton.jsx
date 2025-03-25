import React, { useState, useEffect } from 'react';
import {
  isPhantomInstalled,
  connectPhantomWallet,
  disconnectPhantomWallet,
  isPhantomConnected,
  getConnectedPublicKey,
  setupPhantomEventListeners,
  debugLog,
  openDebugConsole
} from '../src/phantomWallet';

const WalletConnectButton = () => {
  const [walletInstalled, setWalletInstalled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if Phantom is installed and connected on component mount
  useEffect(() => {
    const checkPhantomStatus = () => {
      const installed = isPhantomInstalled();
      setWalletInstalled(installed);
      
      if (installed && isPhantomConnected()) {
        const pubKey = getConnectedPublicKey();
        setPublicKey(pubKey);
        setWalletConnected(true);
      }
    };
    
    checkPhantomStatus();
  }, []);

  // Setup event listeners for wallet connection changes
  useEffect(() => {
    if (!walletInstalled) return;
    
    const removeEventListeners = setupPhantomEventListeners({
      onConnect: (publicKey) => {
        debugLog('Connect event received', publicKey?.toString());
        setWalletConnected(true);
        setPublicKey(publicKey?.toString());
      },
      onDisconnect: () => {
        debugLog('Disconnect event received');
        setWalletConnected(false);
        setPublicKey(null);
      },
      onAccountChange: (publicKey) => {
        if (publicKey) {
          debugLog('Account changed to', publicKey.toString());
          setPublicKey(publicKey.toString());
        }
      }
    });
    
    // Cleanup event listeners on component unmount
    return () => {
      removeEventListeners();
    };
  }, [walletInstalled]);

  // Handle connect button click
  const handleConnect = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      debugLog('Attempting to connect to Phantom wallet...');
      const pubKey = await connectPhantomWallet();
      debugLog('Successfully connected to wallet', pubKey);
      setPublicKey(pubKey);
      setWalletConnected(true);
    } catch (err) {
      debugLog('Error connecting to wallet', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle disconnect button click
  const handleDisconnect = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      debugLog('Attempting to disconnect from Phantom wallet...');
      await disconnectPhantomWallet();
      debugLog('Successfully disconnected from wallet');
      setPublicKey(null);
      setWalletConnected(false);
    } catch (err) {
      debugLog('Error disconnecting from wallet', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle debug button click
  const handleOpenDebug = () => {
    openDebugConsole();
  };

  // Render different button states
  if (!walletInstalled) {
    return (
      <button
        onClick={() => window.open('https://phantom.app/', '_blank')}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z" fill="#AB9FF2"/>
          <path d="M108.56 64.04C108.56 61.4267 106.413 59.28 103.8 59.28H88.6C86.9733 50.7733 79.6267 44.4533 70.7733 44.4533C60.28 44.4533 51.7733 52.96 51.7733 63.4533C51.7733 73.9467 60.28 82.4533 70.7733 82.4533C79.6267 82.4533 86.9733 76.1333 88.6 67.6267H103.8C106.413 67.6267 108.56 65.48 108.56 62.8667V64.04Z" fill="white"/>
          <path d="M51.7733 63.4533C51.7733 52.96 60.28 44.4533 70.7733 44.4533C79.6267 44.4533 86.9733 50.7733 88.6 59.28H103.8C106.413 59.28 108.56 61.4267 108.56 64.04M108.56 62.8667C108.56 65.48 106.413 67.6267 103.8 67.6267H88.6C86.9733 76.1333 79.6267 82.4533 70.7733 82.4533C60.28 82.4533 51.7733 73.9467 51.7733 63.4533Z" stroke="#191B1F" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M27.4933 63.4533C27.4933 73.9467 35.9999 82.4533 46.4933 82.4533C55.3466 82.4533 62.6933 76.1333 64.3199 67.6267H79.5199C82.1333 67.6267 84.2799 65.48 84.2799 62.8667V64.04C84.2799 61.4267 82.1333 59.28 79.5199 59.28H64.3199C62.6933 50.7733 55.3466 44.4533 46.4933 44.4533C35.9999 44.4533 27.4933 52.96 27.4933 63.4533Z" fill="white"/>
          <path d="M27.4933 63.4533C27.4933 52.96 35.9999 44.4533 46.4933 44.4533C55.3466 44.4533 62.6933 50.7733 64.3199 59.28H79.5199C82.1333 59.28 84.2799 61.4267 84.2799 64.04M84.2799 62.8667C84.2799 65.48 82.1333 67.6267 79.5199 67.6267H64.3199C62.6933 76.1333 55.3466 82.4533 46.4933 82.4533C35.9999 82.4533 27.4933 73.9467 27.4933 63.4533Z" stroke="#191B1F" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Install Phantom
      </button>
    );
  }

  if (walletConnected) {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleDisconnect}
          disabled={isLoading}
          className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z" fill="#AB9FF2"/>
            <path d="M108.56 64.04C108.56 61.4267 106.413 59.28 103.8 59.28H88.6C86.9733 50.7733 79.6267 44.4533 70.7733 44.4533C60.28 44.4533 51.7733 52.96 51.7733 63.4533C51.7733 73.9467 60.28 82.4533 70.7733 82.4533C79.6267 82.4533 86.9733 76.1333 88.6 67.6267H103.8C106.413 67.6267 108.56 65.48 108.56 62.8667V64.04Z" fill="white"/>
            <path d="M51.7733 63.4533C51.7733 52.96 60.28 44.4533 70.7733 44.4533C79.6267 44.4533 86.9733 50.7733 88.6 59.28H103.8C106.413 59.28 108.56 61.4267 108.56 64.04M108.56 62.8667C108.56 65.48 106.413 67.6267 103.8 67.6267H88.6C86.9733 76.1333 79.6267 82.4533 70.7733 82.4533C60.28 82.4533 51.7733 73.9467 51.7733 63.4533Z" stroke="#191B1F" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M27.4933 63.4533C27.4933 73.9467 35.9999 82.4533 46.4933 82.4533C55.3466 82.4533 62.6933 76.1333 64.3199 67.6267H79.5199C82.1333 67.6267 84.2799 65.48 84.2799 62.8667V64.04C84.2799 61.4267 82.1333 59.28 79.5199 59.28H64.3199C62.6933 50.7733 55.3466 44.4533 46.4933 44.4533C35.9999 44.4533 27.4933 52.96 27.4933 63.4533Z" fill="white"/>
            <path d="M27.4933 63.4533C27.4933 52.96 35.9999 44.4533 46.4933 44.4533C55.3466 44.4533 62.6933 50.7733 64.3199 59.28H79.5199C82.1333 59.28 84.2799 61.4267 84.2799 64.04M84.2799 62.8667C84.2799 65.48 82.1333 67.6267 79.5199 67.6267H64.3199C62.6933 76.1333 55.3466 82.4533 46.4933 82.4533C35.9999 82.4533 27.4933 73.9467 27.4933 63.4533Z" stroke="#191B1F" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isLoading ? 'Disconnecting...' : 'Disconnect'}
        </button>
        <button
          onClick={handleOpenDebug}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          Debug
        </button>
        <div className="px-4 py-2 bg-gray-800 rounded text-xs text-gray-300 flex items-center overflow-hidden">
          <span className="truncate">{publicKey}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z" fill="#AB9FF2"/>
          <path d="M108.56 64.04C108.56 61.4267 106.413 59.28 103.8 59.28H88.6C86.9733 50.7733 79.6267 44.4533 70.7733 44.4533C60.28 44.4533 51.7733 52.96 51.7733 63.4533C51.7733 73.9467 60.28 82.4533 70.7733 82.4533C79.6267 82.4533 86.9733 76.1333 88.6 67.6267H103.8C106.413 67.6267 108.56 65.48 108.56 62.8667V64.04Z" fill="white"/>
          <path d="M51.7733 63.4533C51.7733 52.96 60.28 44.4533 70.7733 44.4533C79.6267 44.4533 86.9733 50.7733 88.6 59.28H103.8C106.413 59.28 108.56 61.4267 108.56 64.04M108.56 62.8667C108.56 65.48 106.413 67.6267 103.8 67.6267H88.6C86.9733 76.1333 79.6267 82.4533 70.7733 82.4533C60.28 82.4533 51.7733 73.9467 51.7733 63.4533Z" stroke="#191B1F" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M27.4933 63.4533C27.4933 73.9467 35.9999 82.4533 46.4933 82.4533C55.3466 82.4533 62.6933 76.1333 64.3199 67.6267H79.5199C82.1333 67.6267 84.2799 65.48 84.2799 62.8667V64.04C84.2799 61.4267 82.1333 59.28 79.5199 59.28H64.3199C62.6933 50.7733 55.3466 44.4533 46.4933 44.4533C35.9999 44.4533 27.4933 52.96 27.4933 63.4533Z" fill="white"/>
          <path d="M27.4933 63.4533C27.4933 52.96 35.9999 44.4533 46.4933 44.4533C55.3466 44.4533 62.6933 50.7733 64.3199 59.28H79.5199C82.1333 59.28 84.2799 61.4267 84.2799 64.04M84.2799 62.8667C84.2799 65.48 82.1333 67.6267 79.5199 67.6267H64.3199C62.6933 76.1333 55.3466 82.4533 46.4933 82.4533C35.9999 82.4533 27.4933 73.9467 27.4933 63.4533Z" stroke="#191B1F" strokeWidth="2.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>
      <button
        onClick={handleOpenDebug}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
        Debug
      </button>
    </div>
  );
};

export default WalletConnectButton;
