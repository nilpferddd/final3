import React, { useState, useEffect } from 'react';
import { 
  isPhantomInstalled, 
  connectPhantomWallet, 
  isPhantomConnected, 
  getConnectedPublicKey,
  addTokenToPhantomWallet,
  debugLog
} from '../src/phantomWallet';
import { info, error, debug } from '../src/debugUtils';
import WalletConnectButton from './WalletConnectButton';

const LiquidityPoolForm = () => {
  // Form state
  const [tokenAddress, setTokenAddress] = useState('');
  const [pairWithSOL, setPairWithSOL] = useState(true);
  const [pairWithUSDC, setPairWithUSDC] = useState(false);
  const [pairWithCustom, setPairWithCustom] = useState(false);
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [initialLiquidity, setInitialLiquidity] = useState(1000);
  const [slippage, setSlippage] = useState(0.5);
  
  // UI state
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [createdPoolAddress, setCreatedPoolAddress] = useState(null);
  
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
        debug('Wallet already connected:', address);
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
    setCreatedPoolAddress(null);
    
    // Validate form
    if (!tokenAddress) {
      setError('Token address is required');
      error('Token address is required');
      return;
    }
    
    if (pairWithCustom && !customTokenAddress) {
      setError('Custom token address is required when pairing with custom token');
      error('Custom token address is required when pairing with custom token');
      return;
    }
    
    // Check wallet connection
    if (!walletConnected) {
      try {
        debug('Connecting wallet before liquidity pool creation...');
        const address = await connectPhantomWallet();
        setWalletConnected(true);
        setWalletAddress(address);
      } catch (err) {
        setError(`Failed to connect wallet: ${err.message}`);
        error('Failed to connect wallet:', err);
        return;
      }
    }
    
    // Start liquidity pool creation
    setIsCreating(true);
    
    try {
      debug('Creating liquidity pool with parameters:', {
        tokenAddress,
        pairWithSOL,
        pairWithUSDC,
        pairWithCustom,
        customTokenAddress,
        initialLiquidity,
        slippage
      });
      
      // Simulate liquidity pool creation (replace with actual implementation)
      // This is where you would call your liquidity pool creation function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demonstration, generate a random pool address
      const mockPoolAddress = 'PoolAddress' + Math.random().toString(36).substring(2, 15);
      
      debug('Liquidity pool created successfully:', mockPoolAddress);
      setCreatedPoolAddress(mockPoolAddress);
      setSuccess(`Liquidity pool created successfully!`);
      info('Liquidity pool created successfully:', mockPoolAddress);
      
    } catch (err) {
      debug('Error creating liquidity pool:', err);
      setError(`Failed to create liquidity pool: ${err.message}`);
      error('Failed to create liquidity pool:', err);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Create Liquidity Pool</h2>
        <WalletConnectButton />
      </div>
      
      {error && (
        <div className="bg-red-900/50 border border-red-800 text-red-200 p-4 rounded-lg mb-6">
          <strong className="font-medium">Error:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/50 border border-green-800 text-green-200 p-4 rounded-lg mb-6">
          <strong className="font-medium">Success:</strong> {success}
          {createdPoolAddress && (
            <div className="mt-2">
              <strong className="font-medium">Pool Address:</strong>{' '}
              <span className="font-mono text-sm">{createdPoolAddress}</span>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Token Address */}
          <div>
            <label className="block text-gray-300 mb-2">Token Address</label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="Enter token address"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          
          {/* Pair Options */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Pair With</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pairWithSOL}
                    onChange={(e) => setPairWithSOL(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Pair with SOL</span>
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  Create a liquidity pool with SOL
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pairWithUSDC}
                    onChange={(e) => setPairWithUSDC(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Pair with USDC</span>
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  Create a liquidity pool with USDC
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pairWithCustom}
                    onChange={(e) => setPairWithCustom(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Pair with Custom Token</span>
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  Create a liquidity pool with a custom token
                </p>
              </div>
            </div>
          </div>
          
          {/* Custom Token Address (if selected) */}
          {pairWithCustom && (
            <div>
              <label className="block text-gray-300 mb-2">Custom Token Address</label>
              <input
                type="text"
                value={customTokenAddress}
                onChange={(e) => setCustomTokenAddress(e.target.value)}
                placeholder="Enter custom token address"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required={pairWithCustom}
              />
            </div>
          )}
          
          {/* Initial Liquidity */}
          <div>
            <label className="block text-gray-300 mb-2">Initial Liquidity</label>
            <input
              type="number"
              value={initialLiquidity}
              onChange={(e) => setInitialLiquidity(parseFloat(e.target.value))}
              min="0"
              step="0.01"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
          </div>
          
          {/* Slippage */}
          <div>
            <label className="block text-gray-300 mb-2">Slippage Tolerance (%)</label>
            <input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value))}
              min="0.1"
              max="100"
              step="0.1"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
          </div>
          
          {/* Submit Button */}
          <div>
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
                'Creating Liquidity Pool...'
              ) : !walletConnected ? (
                'Connect Wallet to Create Liquidity Pool'
              ) : (
                'Create Liquidity Pool'
              )}
            </button>
          </div>
        </div>
      </form>
      
      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-400">Debug Information</h3>
          <span className="text-xs text-gray-500">Press Ctrl+Shift+D to open debug console</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>Wallet Connected: {walletConnected ? 'Yes' : 'No'}</p>
          {walletAddress && <p>Wallet Address: {walletAddress}</p>}
        </div>
      </div>
    </div>
  );
};

export default LiquidityPoolForm;
