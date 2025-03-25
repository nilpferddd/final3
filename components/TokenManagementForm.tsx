import { useState, useEffect } from 'react';
import { getPhantomWallet } from '../src/walletIntegration';
import WalletConnectButton from '../components/WalletConnectButton';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

export default function TokenManagementForm() {
  // State for user's tokens
  const [userTokens, setUserTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [tokenDetails, setTokenDetails] = useState(null);
  
  // Wallet connection
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  
  // Handle wallet connection
  const handleWalletConnect = (publicKey) => {
    setWalletConnected(true);
    setWalletPublicKey(publicKey);
    setDebugInfo(`Wallet connected: ${publicKey.toString()}`);
    
    // Fetch user's tokens
    fetchUserTokens(publicKey);
  };
  
  // Fetch user's tokens from their wallet
  const fetchUserTokens = async (publicKey) => {
    try {
      setIsLoading(true);
      setDebugInfo('Fetching user tokens...');
      
      // In a real implementation, we would query the blockchain for the user's tokens
      // For now, we'll just clear any previous tokens
      setUserTokens([]);
      
      // If we had a real connection to the Solana blockchain:
      // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, ...);
      // const tokens = tokenAccounts.value.map(...);
      // setUserTokens(tokens);
      
      setDebugInfo('User tokens fetched successfully');
    } catch (err) {
      console.error('Error fetching user tokens:', err);
      setError('Failed to fetch tokens. Please try again.');
      setDebugInfo(`Error fetching user tokens: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle wallet disconnection
  const handleWalletDisconnect = () => {
    setWalletConnected(false);
    setWalletPublicKey(null);
    setUserTokens([]);
    setSelectedToken('');
    setTokenDetails(null);
    setDebugInfo('Wallet disconnected');
  };
  
  // Handle token selection
  const handleTokenSelect = async (tokenMint) => {
    try {
      setIsLoading(true);
      setSelectedToken(tokenMint);
      setTokenDetails(null);
      setError('');
      
      if (!tokenMint) {
        return;
      }
      
      setDebugInfo(`Fetching details for token: ${tokenMint}`);
      
      // In a real implementation, we would fetch token details from the blockchain
      // For now, we'll simulate token details
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes only
      const token = userTokens.find(t => t.mint === tokenMint);
      if (token) {
        setTokenDetails({
          mint: token.mint,
          name: token.name,
          symbol: token.symbol,
          supply: token.supply,
          decimals: token.decimals,
          freezeAuthority: Math.random() > 0.5 ? 'Revoked' : walletPublicKey?.toString(),
          mintAuthority: Math.random() > 0.5 ? 'Revoked' : walletPublicKey?.toString(),
          updateAuthority: Math.random() > 0.5 ? 'Revoked' : walletPublicKey?.toString(),
        });
      }
      
      setDebugInfo('Token details fetched successfully');
    } catch (err) {
      console.error('Error fetching token details:', err);
      setError('Failed to fetch token details. Please try again.');
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle revoke authority
  const handleRevokeAuthority = async (authorityType) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      if (!selectedToken || !tokenDetails) {
        throw new Error('No token selected');
      }
      
      setDebugInfo(`Revoking ${authorityType} authority for token: ${selectedToken}`);
      
      // In a real implementation, we would send a transaction to revoke the authority
      // For now, we'll simulate the revocation
      
      // Simulate transaction time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update token details
      setTokenDetails(prev => ({
        ...prev,
        [authorityType]: 'Revoked'
      }));
      
      setSuccess(`${authorityType} authority revoked successfully!`);
      setDebugInfo(`${authorityType} authority revoked successfully`);
    } catch (err) {
      console.error(`Error revoking ${authorityType} authority:`, err);
      setError(`Failed to revoke ${authorityType} authority. Please try again.`);
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-solana-green mb-8">Manage Tokens</h1>
      
      <div className="mb-8 flex justify-end">
        <WalletConnectButton 
          onConnect={handleWalletConnect} 
          onDisconnect={handleWalletDisconnect} 
        />
      </div>
      
      {!walletConnected ? (
        <div className="bg-dark-blue p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Please connect your Solana wallet to manage your tokens.</p>
          <WalletConnectButton 
            onConnect={handleWalletConnect} 
            onDisconnect={handleWalletDisconnect} 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-dark-blue p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-solana-green mb-4">Your Tokens</h2>
            
            {isLoading && !userTokens.length ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin text-4xl mb-4">⟳</div>
                <p className="text-gray-300">Loading your tokens...</p>
              </div>
            ) : userTokens.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Select a token to manage</label>
                  <select
                    value={selectedToken}
                    onChange={(e) => handleTokenSelect(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  >
                    <option value="">Select a token</option>
                    {userTokens.map((token) => (
                      <option key={token.mint} value={token.mint}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="text-5xl mb-4">🪙</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Tokens Found</h3>
                <p className="text-gray-400 mb-6">You don't have any tokens in your wallet yet.</p>
                <a 
                  href="/create-token" 
                  className="inline-block bg-solana-purple hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
                >
                  Create a Token
                </a>
              </div>
            )}
          </div>
          
          {selectedToken && tokenDetails && (
            <div className="bg-dark-blue p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-solana-green mb-4">Token Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-medium">{tokenDetails.name}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Symbol</p>
                  <p className="text-white font-medium">{tokenDetails.symbol}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Mint Address</p>
                  <p className="text-white font-medium text-xs break-all">{tokenDetails.mint}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Decimals</p>
                  <p className="text-white font-medium">{tokenDetails.decimals}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Supply</p>
                  <p className="text-white font-medium">{tokenDetails.supply}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-3">Authorities</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-white font-medium">Freeze Authority</h4>
                      <p className="text-gray-400 text-sm">
                        {tokenDetails.freezeAuthority === 'Revoked' 
                          ? 'Revoked (Cannot freeze token accounts)' 
                          : 'Active (Can freeze token accounts)'}
                      </p>
                    </div>
                    
                    {tokenDetails.freezeAuthority !== 'Revoked' && (
                      <button
                        type="button"
                        onClick={() => handleRevokeAuthority('freezeAuthority')}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Revoking...' : 'Revoke'}
                      </button>
                    )}
                  </div>
                  
                  {tokenDetails.freezeAuthority !== 'Revoked' && (
                    <p className="text-xs text-gray-500">
                      Current authority: {tokenDetails.freezeAuthority.slice(0, 4)}...{tokenDetails.freezeAuthority.slice(-4)}
                    </p>
                  )}
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-white font-medium">Mint Authority</h4>
                      <p className="text-gray-400 text-sm">
                        {tokenDetails.mintAuthority === 'Revoked' 
                          ? 'Revoked (Cannot mint new tokens)' 
                          : 'Active (Can mint new tokens)'}
                      </p>
                    </div>
                    
                    {tokenDetails.mintAuthority !== 'Revoked' && (
                      <button
                        type="button"
                        onClick={() => handleRevokeAuthority('mintAuthority')}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Revoking...' : 'Revoke'}
                      </button>
                    )}
                  </div>
                  
                  {tokenDetails.mintAuthority !== 'Revoked' && (
                    <p className="text-xs text-gray-500">
                      Current authority: {tokenDetails.mintAuthority.slice(0, 4)}...{tokenDetails.mintAuthority.slice(-4)}
                    </p>
                  )}
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-white font-medium">Update Authority</h4>
                      <p className="text-gray-400 text-sm">
                        {tokenDetails.updateAuthority === 'Revoked' 
                          ? 'Revoked (Cannot update metadata)' 
                          : 'Active (Can update metadata)'}
                      </p>
                    </div>
                    
                    {tokenDetails.updateAuthority !== 'Revoked' && (
                      <button
                        type="button"
                        onClick={() => handleRevokeAuthority('updateAuthority')}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Revoking...' : 'Revoke'}
                      </button>
                    )}
                  </div>
                  
                  {tokenDetails.updateAuthority !== 'Revoked' && (
                    <p className="text-xs text-gray-500">
                      Current authority: {tokenDetails.updateAuthority.slice(0, 4)}...{tokenDetails.updateAuthority.slice(-4)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-white font-medium mb-2">Debug Information</h3>
              <pre className="text-gray-400 text-xs overflow-auto max-h-40">
                {debugInfo || 'No debug information available'}
              </pre>
            </div>
          )}
          
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-900/50 text-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/50 text-green-200 p-4 rounded-lg">
              {success}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
