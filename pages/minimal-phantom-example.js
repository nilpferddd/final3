import React, { useState, useEffect } from 'react';
import {
  isPhantomInstalled,
  getPhantomProvider,
  connectPhantomWallet,
  disconnectPhantomWallet,
  addTokenToPhantomWallet,
  setupPhantomEventListeners,
  isPhantomConnected,
  getConnectedPublicKey
} from '../src/phantomWallet';

export default function MinimalPhantomExample() {
  // State variables
  const [walletInstalled, setWalletInstalled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [tokenAddress, setTokenAddress] = useState('');

  // Add a log message with timestamp
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [...prevLogs, `[${timestamp}] ${message}`]);
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Check if Phantom is installed on component mount
  useEffect(() => {
    const checkPhantomInstallation = () => {
      const installed = isPhantomInstalled();
      setWalletInstalled(installed);
      addLog(`Phantom wallet ${installed ? 'is' : 'is not'} installed`);
      
      // Check if already connected
      if (installed && isPhantomConnected()) {
        setWalletConnected(true);
        const pubKey = getConnectedPublicKey();
        setPublicKey(pubKey);
        addLog(`Already connected to wallet: ${pubKey}`);
      }
    };
    
    checkPhantomInstallation();
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!walletInstalled) return;
    
    const removeEventListeners = setupPhantomEventListeners({
      onConnect: (publicKey) => {
        addLog(`Connected event received: ${publicKey?.toString()}`);
        setWalletConnected(true);
        setPublicKey(publicKey?.toString());
      },
      onDisconnect: () => {
        addLog('Disconnected event received');
        setWalletConnected(false);
        setPublicKey(null);
      },
      onAccountChange: (publicKey) => {
        if (publicKey) {
          addLog(`Account changed to: ${publicKey.toString()}`);
          setPublicKey(publicKey.toString());
        } else {
          addLog('Account changed but no public key provided');
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
      addLog('Attempting to connect to Phantom wallet...');
      const pubKey = await connectPhantomWallet();
      addLog(`Successfully connected to wallet: ${pubKey}`);
      setPublicKey(pubKey);
      setWalletConnected(true);
    } catch (err) {
      addLog(`Error connecting to wallet: ${err.message}`);
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
      addLog('Attempting to disconnect from Phantom wallet...');
      await disconnectPhantomWallet();
      addLog('Successfully disconnected from wallet');
      setPublicKey(null);
      setWalletConnected(false);
    } catch (err) {
      addLog(`Error disconnecting from wallet: ${err.message}`);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add token button click
  const handleAddToken = async () => {
    if (!tokenAddress) {
      setError('Please enter a token address');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      addLog(`Attempting to add token to wallet: ${tokenAddress}`);
      await addTokenToPhantomWallet(tokenAddress);
      addLog(`Successfully added token to wallet: ${tokenAddress}`);
    } catch (err) {
      addLog(`Error adding token to wallet: ${err.message}`);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle install Phantom button click
  const handleInstallPhantom = () => {
    window.open('https://phantom.app/', '_blank');
    addLog('Opening Phantom website for installation');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">
          Minimal Phantom Wallet Integration Example
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wallet Status and Actions */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-300">Wallet Status</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Phantom Installed:</span>
                  <span className={walletInstalled ? "text-green-400" : "text-red-400"}>
                    {walletInstalled ? "Yes ✓" : "No ✗"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Wallet Connected:</span>
                  <span className={walletConnected ? "text-green-400" : "text-red-400"}>
                    {walletConnected ? "Yes ✓" : "No ✗"}
                  </span>
                </div>
                
                {publicKey && (
                  <div>
                    <span className="block mb-1">Public Key:</span>
                    <span className="block bg-gray-700 p-2 rounded text-xs break-all">
                      {publicKey}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-300">Wallet Actions</h2>
              
              <div className="space-y-4">
                {!walletInstalled ? (
                  <button
                    onClick={handleInstallPhantom}
                    className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    Install Phantom Wallet
                  </button>
                ) : !walletConnected ? (
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isLoading 
                        ? "bg-gray-600 cursor-not-allowed" 
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </button>
                ) : (
                  <button
                    onClick={handleDisconnect}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isLoading 
                        ? "bg-gray-600 cursor-not-allowed" 
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isLoading ? "Disconnecting..." : "Disconnect Wallet"}
                  </button>
                )}
                
                {walletConnected && (
                  <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-medium mb-3 text-purple-300">Add Token to Wallet</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        placeholder="Enter token address"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      />
                      <button
                        onClick={handleAddToken}
                        disabled={isLoading || !tokenAddress}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          isLoading || !tokenAddress
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isLoading ? "Adding Token..." : "Add Token to Wallet"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {error && (
              <div className="bg-red-900/50 border border-red-800 text-red-200 p-4 rounded-lg">
                <strong className="font-medium">Error:</strong> {error}
              </div>
            )}
          </div>
          
          {/* Logs */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-300">Event Logs</h2>
              <button
                onClick={clearLogs}
                disabled={logs.length === 0}
                className={`text-xs py-1 px-3 rounded ${
                  logs.length === 0
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                Clear Logs
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 h-[400px] overflow-y-auto">
              {logs.length > 0 ? (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  No logs yet. Actions will be recorded here.
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Instructions</h2>
          
          <div className="space-y-4">
            <p>
              This is a minimal example of Phantom wallet integration. Follow these steps to test:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Make sure you have the Phantom wallet browser extension installed</li>
              <li>Click "Connect Wallet" to trigger the connection popup</li>
              <li>Approve the connection request in the Phantom wallet popup</li>
              <li>Once connected, you can add tokens to your wallet or disconnect</li>
            </ol>
            
            <div className="bg-blue-900/30 border border-blue-800/50 p-4 rounded-lg mt-4">
              <p className="text-blue-300 font-medium">Important Notes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                <li>This example uses direct integration with the Phantom provider</li>
                <li>The popup should appear when you click "Connect Wallet"</li>
                <li>All wallet events are logged in the Event Logs panel</li>
                <li>If you don't see the popup, make sure popups are allowed in your browser</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
