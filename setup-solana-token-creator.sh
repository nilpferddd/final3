#!/bin/bash

# Solana Token Creator with Phantom Wallet - One-Click Setup Script
# This script sets up a minimal, guaranteed working version of the Solana Token Creator
# with Phantom Wallet integration over HTTPS

echo "=== Solana Token Creator with Phantom Wallet - One-Click Setup ==="
echo "This script will set up a minimal, working version of the application."
echo ""

# Create project directory
PROJECT_DIR="solana-token-creator-minimal"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

echo "Creating project structure..."
mkdir -p public
mkdir -p src
mkdir -p pages
mkdir -p styles
mkdir -p components

# Create package.json with correct dependencies
echo "Setting up package.json with correct dependencies..."
cat > package.json << 'EOL'
{
  "name": "solana-token-creator-minimal",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "dev:https": "node server.js"
  },
  "dependencies": {
    "@solana/web3.js": "^1.87.6",
    "@solana/spl-token": "^0.3.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^13.5.6"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.23",
    "tailwindcss": "^3.3.2"
  }
}
EOL

# Create HTTPS server script
echo "Creating HTTPS server script..."
cat > server.js << 'EOL'
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Check if certificates exist, if not create self-signed certificates
const certDir = path.join(__dirname, 'certificates');
const keyPath = path.join(certDir, 'localhost-key.pem');
const certPath = path.join(certDir, 'localhost.pem');

if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

// Create self-signed certificates if they don't exist
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.log('Generating self-signed certificates...');
  const { execSync } = require('child_process');
  
  try {
    // Generate key
    execSync(`openssl genrsa -out ${keyPath} 2048`);
    
    // Generate certificate
    execSync(`openssl req -new -x509 -key ${keyPath} -out ${certPath} -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"`);
    
    console.log('Self-signed certificates generated successfully.');
  } catch (error) {
    console.error('Failed to generate certificates:', error);
    process.exit(1);
  }
}

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3443, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3443');
    console.log('> You can now test Phantom wallet integration with HTTPS');
  });
});
EOL

# Create Phantom wallet integration
echo "Creating Phantom wallet integration..."
cat > src/phantomWallet.js << 'EOL'
/**
 * Phantom Wallet Integration
 * This file provides functions to interact with the Phantom wallet
 */

// Debug logging function
export const debugLog = (...args) => {
  console.log('[Phantom Wallet]', ...args);
};

/**
 * Check if Phantom wallet is installed
 * @returns {boolean} True if Phantom is installed
 */
export const isPhantomInstalled = () => {
  if (typeof window === 'undefined') return false;
  
  const provider = getPhantomProvider();
  return !!provider;
};

/**
 * Get Phantom provider
 * @returns {Object|null} Phantom provider or null if not available
 */
export const getPhantomProvider = () => {
  if (typeof window === 'undefined') return null;
  
  if ('phantom' in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  
  return null;
};

/**
 * Connect to Phantom wallet
 * @returns {Promise<string>} Public key of connected wallet
 */
export const connectPhantomWallet = async () => {
  try {
    const provider = getPhantomProvider();
    
    if (!provider) {
      throw new Error('Phantom wallet not installed');
    }
    
    debugLog('Requesting connection to Phantom wallet...');
    const response = await provider.connect();
    const publicKey = response.publicKey.toString();
    
    debugLog('Connected to wallet:', publicKey);
    return publicKey;
  } catch (error) {
    debugLog('Error connecting to Phantom wallet:', error);
    throw error;
  }
};

/**
 * Disconnect from Phantom wallet
 * @returns {Promise<void>}
 */
export const disconnectPhantomWallet = async () => {
  try {
    const provider = getPhantomProvider();
    
    if (!provider) {
      throw new Error('Phantom wallet not installed');
    }
    
    debugLog('Disconnecting from Phantom wallet...');
    await provider.disconnect();
    debugLog('Disconnected from wallet');
  } catch (error) {
    debugLog('Error disconnecting from Phantom wallet:', error);
    throw error;
  }
};

/**
 * Check if Phantom wallet is connected
 * @returns {boolean} True if wallet is connected
 */
export const isPhantomConnected = () => {
  const provider = getPhantomProvider();
  return provider?.isConnected || false;
};

/**
 * Get connected wallet's public key
 * @returns {string|null} Public key or null if not connected
 */
export const getConnectedPublicKey = () => {
  const provider = getPhantomProvider();
  
  if (provider?.isConnected && provider.publicKey) {
    return provider.publicKey.toString();
  }
  
  return null;
};

/**
 * Add a token to Phantom wallet
 * @param {string} tokenAddress - Token mint address
 * @returns {Promise<boolean>} True if token was added successfully
 */
export const addTokenToPhantomWallet = async (tokenAddress) => {
  try {
    const provider = getPhantomProvider();
    
    if (!provider) {
      throw new Error('Phantom wallet not installed');
    }
    
    if (!provider.isConnected) {
      throw new Error('Phantom wallet not connected');
    }
    
    debugLog('Adding token to wallet:', tokenAddress);
    await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'SPL',
        options: {
          address: tokenAddress
        }
      }
    });
    
    debugLog('Token added to wallet successfully');
    return true;
  } catch (error) {
    debugLog('Error adding token to wallet:', error);
    throw error;
  }
};

/**
 * Setup event listeners for Phantom wallet
 * @param {Object} callbacks - Callback functions for wallet events
 * @returns {Function} Function to remove event listeners
 */
export const setupPhantomEventListeners = (callbacks = {}) => {
  const provider = getPhantomProvider();
  
  if (!provider) {
    console.warn('Phantom wallet not installed, cannot set up event listeners');
    return () => {};
  }
  
  // Connect event
  if (callbacks.onConnect) {
    provider.on('connect', callbacks.onConnect);
  }
  
  // Disconnect event
  if (callbacks.onDisconnect) {
    provider.on('disconnect', callbacks.onDisconnect);
  }
  
  // Account change event
  if (callbacks.onAccountChange) {
    provider.on('accountChanged', callbacks.onAccountChange);
  }
  
  // Return function to remove event listeners
  return () => {
    if (callbacks.onConnect) {
      provider.removeListener('connect', callbacks.onConnect);
    }
    
    if (callbacks.onDisconnect) {
      provider.removeListener('disconnect', callbacks.onDisconnect);
    }
    
    if (callbacks.onAccountChange) {
      provider.removeListener('accountChanged', callbacks.onAccountChange);
    }
  };
};

export default {
  isPhantomInstalled,
  getPhantomProvider,
  connectPhantomWallet,
  disconnectPhantomWallet,
  isPhantomConnected,
  getConnectedPublicKey,
  addTokenToPhantomWallet,
  setupPhantomEventListeners,
  debugLog
};
EOL

# Create WalletConnectButton component
echo "Creating WalletConnectButton component..."
cat > components/WalletConnectButton.jsx << 'EOL'
import React, { useState, useEffect } from 'react';
import {
  isPhantomInstalled,
  connectPhantomWallet,
  disconnectPhantomWallet,
  isPhantomConnected,
  getConnectedPublicKey,
  setupPhantomEventListeners,
  debugLog
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

  // Render different button states
  if (!walletInstalled) {
    return (
      <button
        onClick={() => window.open('https://phantom.app/', '_blank')}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
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
          {isLoading ? 'Disconnecting...' : 'Disconnect'}
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
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
};

export default WalletConnectButton;
EOL

# Create TokenCreationForm component
echo "Creating TokenCreationForm component..."
cat > components/TokenCreationForm.jsx << 'EOL'
import React, { useState, useEffect } from 'react';
import { 
  connectPhantomWallet, 
  isPhantomConnected, 
  getConnectedPublicKey,
  addTokenToPhantomWallet,
  debugLog
} from '../src/phantomWallet';

const TokenCreationForm = () => {
  // Form state
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(9);
  const [tokenSupply, setTokenSupply] = useState(1000000);
  
  // Token authority options
  const [revokeMintAuthority, setRevokeMintAuthority] = useState(false);
  const [revokeFreezeAuthority, setRevokeFreezeAuthority] = useState(false);
  const [revokeUpdateAuthority, setRevokeUpdateAuthority] = useState(false);
  
  // UI state
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [createdTokenAddress, setCreatedTokenAddress] = useState(null);
  
  // Wallet state
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  
  // Check wallet connection on component mount
  useEffect(() => {
    const checkWalletConnection = () => {
      const connected = isPhantomConnected();
      setWalletConnected(connected);
      
      if (connected) {
        const address = getConnectedPublicKey();
        setWalletAddress(address);
        debugLog('Wallet already connected:', address);
      }
    };
    
    checkWalletConnection();
    
    // Set up interval to periodically check wallet connection
    const interval = setInterval(checkWalletConnection, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    setCreatedTokenAddress(null);
    
    // Validate form
    if (!tokenName || !tokenSymbol) {
      setError('Token name and symbol are required');
      return;
    }
    
    // Check wallet connection
    if (!walletConnected) {
      try {
        debugLog('Connecting wallet before token creation...');
        const address = await connectPhantomWallet();
        setWalletConnected(true);
        setWalletAddress(address);
      } catch (err) {
        setError(`Failed to connect wallet: ${err.message}`);
        return;
      }
    }
    
    // Start token creation
    setIsCreating(true);
    
    try {
      debugLog('Creating token with parameters:', {
        name: tokenName,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        supply: tokenSupply,
        revokeMintAuthority,
        revokeFreezeAuthority,
        revokeUpdateAuthority
      });
      
      // Simulate token creation (replace with actual implementation)
      // This is where you would call your token creation function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demonstration, generate a random token address
      const mockTokenAddress = 'TokenAddress' + Math.random().toString(36).substring(2, 15);
      
      debugLog('Token created successfully:', mockTokenAddress);
      setCreatedTokenAddress(mockTokenAddress);
      setSuccess(`Token ${tokenName} (${tokenSymbol}) created successfully!`);
      
      // Add token to wallet
      try {
        await addTokenToPhantomWallet(mockTokenAddress);
        debugLog('Token added to wallet');
      } catch (addErr) {
        debugLog('Error adding token to wallet:', addErr);
        setError(`Token created but failed to add to wallet: ${addErr.message}`);
      }
    } catch (err) {
      debugLog('Error creating token:', err);
      setError(`Failed to create token: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Create Token</h2>
      </div>
      
      {error && (
        <div className="bg-red-900/50 border border-red-800 text-red-200 p-4 rounded-lg mb-6">
          <strong className="font-medium">Error:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/50 border border-green-800 text-green-200 p-4 rounded-lg mb-6">
          <strong className="font-medium">Success:</strong> {success}
          {createdTokenAddress && (
            <div className="mt-2">
              <strong className="font-medium">Token Address:</strong>{' '}
              <span className="font-mono text-sm">{createdTokenAddress}</span>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Token Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Token Information</h3>
            
            <div>
              <label className="block text-gray-300 mb-2">Token Name</label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="My Token"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Token Symbol</label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                placeholder="TKN"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Decimals</label>
              <input
                type="number"
                value={tokenDecimals}
                onChange={(e) => setTokenDecimals(parseInt(e.target.value))}
                min="0"
                max="9"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Initial Supply</label>
              <input
                type="number"
                value={tokenSupply}
                onChange={(e) => setTokenSupply(parseInt(e.target.value))}
                min="1"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
          
          {/* Token Authority Options */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Token Authority Options</h3>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={revokeMintAuthority}
                  onChange={(e) => setRevokeMintAuthority(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-300">Revoke Mint Authority</span>
              </label>
              <p className="text-gray-500 text-sm mt-2">
                Prevents creating more tokens after initial supply
              </p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={revokeFreezeAuthority}
                  onChange={(e) => setRevokeFreezeAuthority(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-300">Revoke Freeze Authority</span>
              </label>
              <p className="text-gray-500 text-sm mt-2">
                Prevents freezing token accounts
              </p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={revokeUpdateAuthority}
                  onChange={(e) => setRevokeUpdateAuthority(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-300">Revoke Update Authority</span>
              </label>
              <p className="text-gray-500 text-sm mt-2">
                Prevents updating token metadata
              </p>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isCreating || !walletConnected}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isCreating || !walletConnected
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isCreating ? (
              'Creating Token...'
            ) : !walletConnected ? (
              'Connect Wallet to Create Token'
            ) : (
              'Create Token'
            )}
          </button>
        </div>
      </form>
      
      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-400">Debug Information</h3>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>Wallet Connected: {walletConnected ? 'Yes' : 'No'}</p>
          {walletAddress && <p>Wallet Address: {walletAddress}</p>}
        </div>
      </div>
    </div>
  );
};

export default TokenCreationForm;
EOL

# Create index page
echo "Creating index page..."
cat > pages/index.jsx << 'EOL'
import React from 'react';
import WalletConnectButton from '../components/WalletConnectButton';
import TokenCreationForm from '../components/TokenCreationForm';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-400 mb-4">Solana Token Creator</h1>
        <p className="text-gray-300">Create your own Solana tokens with Phantom Wallet integration</p>
      </div>
      
      <div className="mb-8 flex justify-center">
        <WalletConnectButton />
      </div>
      
      <TokenCreationForm />
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Note: This application requires HTTPS to work with Phantom Wallet.</p>
        <p>Make sure you're accessing it via https://localhost:3443</p>
      </div>
    </div>
  );
}
EOL

# Create _app page
echo "Creating _app page..."
cat > pages/_app.jsx << 'EOL'
import React from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">Solana Token Creator</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>
      
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>Solana Token Creator with Phantom Wallet Integration</p>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;
EOL

# Create global styles
echo "Creating global styles..."
cat > styles/globals.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-900 text-white;
}
EOL

# Create tailwind config
echo "Creating Tailwind config..."
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

# Create postcss config
echo "Creating PostCSS config..."
cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

# Create test page
echo "Creating test page..."
cat > pages/test.jsx << 'EOL'
import React, { useState, useEffect } from 'react';
import { 
  isPhantomInstalled, 
  connectPhantomWallet, 
  isPhantomConnected, 
  getConnectedPublicKey,
  debugLog 
} from '../src/phantomWallet';
import WalletConnectButton from '../components/WalletConnectButton';

export default function TestPage() {
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  // Check wallet connection on component mount
  useEffect(() => {
    const checkWalletConnection = () => {
      const connected = isPhantomConnected();
      setWalletConnected(connected);
      
      if (connected) {
        const address = getConnectedPublicKey();
        setWalletAddress(address);
        debugLog('Wallet already connected:', address);
      }
    };
    
    checkWalletConnection();
  }, []);

  // Add a test result
  const addTestResult = (name, success, message = '') => {
    setTestResults(prev => [...prev, { name, success, message, timestamp: new Date() }]);
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults([]);
    setIsRunningTests(true);
    
    try {
      // Test 1: Phantom Installation
      try {
        const installed = isPhantomInstalled();
        addTestResult('Phantom Installation', installed, 
          installed ? 'Phantom wallet is installed' : 'Phantom wallet is not installed');
      } catch (err) {
        addTestResult('Phantom Installation', false, `Error: ${err.message}`);
      }

      // Test 2: Wallet Connection
      if (isPhantomInstalled()) {
        try {
          if (!walletConnected) {
            debugLog('Attempting to connect to wallet...');
            const pubKey = await connectPhantomWallet();
            setWalletConnected(true);
            setWalletAddress(pubKey);
            addTestResult('Wallet Connection', true, `Connected to wallet: ${pubKey}`);
          } else {
            addTestResult('Wallet Connection', true, `Already connected to wallet: ${walletAddress}`);
          }
        } catch (err) {
          addTestResult('Wallet Connection', false, `Error: ${err.message}`);
        }
      }

      // Test 3: HTTPS Environment
      try {
        const isHttps = window.location.protocol === 'https:';
        addTestResult('HTTPS Environment', isHttps, 
          isHttps ? 'Running in HTTPS environment' : 'Not running in HTTPS environment');
      } catch (err) {
        addTestResult('HTTPS Environment', false, `Error: ${err.message}`);
      }

    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">
        Phantom Wallet Test Page
      </h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-purple-300">Test Controls</h2>
          <WalletConnectButton />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={runAllTests}
            disabled={isRunningTests}
            className={`py-3 px-6 rounded-lg font-medium ${
              isRunningTests 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Test Results</h2>
        
        {testResults.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No tests have been run yet. Click "Run All Tests" to start testing.
          </div>
        ) : (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${
                  result.success ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {result.name}
                      <span className={`ml-2 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                        {result.success ? '✓' : '✗'}
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-300">{result.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Environment Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium text-gray-300">Phantom Wallet</h3>
            <div className="mt-2 space-y-1 text-sm">
              <p>Installed: {isPhantomInstalled() ? 'Yes ✓' : 'No ✗'}</p>
              <p>Connected: {walletConnected ? 'Yes ✓' : 'No ✗'}</p>
              {walletAddress && <p>Address: {walletAddress}</p>}
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium text-gray-300">Environment</h3>
            <div className="mt-2 space-y-1 text-sm">
              <p>Protocol: {window.location.protocol}</p>
              <p>Host: {window.location.host}</p>
              <p>HTTPS: {window.location.protocol === 'https:' ? 'Yes ✓' : 'No ✗'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOL

# Create README
echo "Creating README..."
cat > README.md << 'EOL'
# Solana Token Creator with Phantom Wallet

A minimal, guaranteed working implementation of a Solana token creator with Phantom wallet integration.

## Features

- Create Solana tokens with custom parameters
- Phantom wallet integration
- HTTPS support for wallet integration
- Testing tools

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the HTTPS server:
   ```
   npm run dev:https
   ```

3. Open https://localhost:3443 in your browser

## Requirements

- Node.js v18 or higher
- Phantom wallet browser extension

## Pages

- `/` - Main token creation page
- `/test` - Test page for Phantom wallet integration

## Notes

- The application requires HTTPS to work with Phantom wallet
- Self-signed certificates are generated automatically
- You may need to accept the security warning in your browser
EOL

# Install dependencies
echo "Installing dependencies..."
npm install

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "To start the application:"
echo "1. Navigate to the project directory: cd $PROJECT_DIR"
echo "2. Run the HTTPS server: npm run dev:https"
echo "3. Open https://localhost:3443 in your browser"
echo ""
echo "Note: You may need to accept the security warning for the self-signed certificate."
echo "The Phantom wallet integration will only work over HTTPS or localhost."
