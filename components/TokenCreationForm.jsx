import React, { useState, useEffect } from 'react';
import { 
  connectPhantomWallet, 
  isPhantomConnected, 
  getConnectedPublicKey,
  addTokenToPhantomWallet,
  debugLog
} from '../src/phantomWallet';
import WalletConnectButton from './WalletConnectButton';

const TokenCreationForm = () => {
  // Form state
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(9);
  const [tokenSupply, setTokenSupply] = useState(1000000);
  const [tokenImage, setTokenImage] = useState('');
  const [tokenWebsite, setTokenWebsite] = useState('');
  const [tokenTwitter, setTokenTwitter] = useState('');
  const [tokenTelegram, setTokenTelegram] = useState('');
  
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
          
          {/* Token Metadata */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Token Metadata</h3>
            
            <div>
              <label className="block text-gray-300 mb-2">Token Image URL</label>
              <input
                type="text"
                value={tokenImage}
                onChange={(e) => setTokenImage(e.target.value)}
                placeholder="https://example.com/token-image.png"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Website</label>
              <input
                type="text"
                value={tokenWebsite}
                onChange={(e) => setTokenWebsite(e.target.value)}
                placeholder="https://mytoken.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Twitter</label>
              <input
                type="text"
                value={tokenTwitter}
                onChange={(e) => setTokenTwitter(e.target.value)}
                placeholder="https://twitter.com/mytoken"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Telegram</label>
              <input
                type="text"
                value={tokenTelegram}
                onChange={(e) => setTokenTelegram(e.target.value)}
                placeholder="https://t.me/mytoken"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
        </div>
        
        {/* Token Authority Options */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Token Authority Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <span className="text-xs text-gray-500">Press Ctrl+Shift+P to open debug console</span>
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
