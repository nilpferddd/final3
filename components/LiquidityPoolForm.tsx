import { useState, useEffect } from 'react';
import { getPhantomWallet } from '../src/walletIntegration';
import WalletConnectButton from '../components/WalletConnectButton';

export default function LiquidityPoolForm() {
  // Form state
  const [baseToken, setBaseToken] = useState('');
  const [quoteToken, setQuoteToken] = useState('SOL');
  const [baseAmount, setBaseAmount] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [userTokens, setUserTokens] = useState([]);
  
  // Wallet connection
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  
  // Handle wallet connection
  const handleWalletConnect = (publicKey) => {
    setWalletConnected(true);
    setWalletPublicKey(publicKey);
    setDebugInfo(`Wallet connected: ${publicKey.toString()}`);
    
    // Fetch user's actual tokens from the wallet
    fetchUserTokens(publicKey);
  };
  
  // Fetch user's tokens from their wallet
  const fetchUserTokens = async (publicKey) => {
    try {
      setDebugInfo('Fetching user tokens...');
      
      // In a real implementation, we would query the blockchain for the user's tokens
      // For now, we'll just clear the sample tokens
      setUserTokens([]);
      
      // If we had a real connection to the Solana blockchain:
      // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, ...);
      // const tokens = tokenAccounts.value.map(...);
      // setUserTokens(tokens);
      
      setDebugInfo('User tokens fetched successfully');
    } catch (err) {
      console.error('Error fetching user tokens:', err);
      setDebugInfo(`Error fetching user tokens: ${err.message}`);
    }
  };
  
  // Handle wallet disconnection
  const handleWalletDisconnect = () => {
    setWalletConnected(false);
    setWalletPublicKey(null);
    setUserTokens([]);
    setDebugInfo('Wallet disconnected');
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      setDebugInfo('Submitting liquidity pool form...');
      
      // Validate form
      if (!baseToken || !quoteToken || !baseAmount || !quoteAmount) {
        throw new Error('Please fill in all required fields');
      }
      
      // Log form data for debugging
      console.log('Liquidity pool form data:', {
        baseToken,
        quoteToken,
        baseAmount,
        quoteAmount,
        startDate: startDate || 'Immediate',
      });
      
      // In a real implementation, this would call the liquidity pool creation service
      // For now, we'll simulate a successful liquidity pool creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Liquidity pool created successfully! Transaction ID: ' + Math.random().toString(36).substring(2, 15));
      setDebugInfo('Liquidity pool creation successful');
      
      // Reset form after successful submission
      // resetForm();
    } catch (err) {
      console.error('Error creating liquidity pool:', err);
      setError(err.message || 'Failed to create liquidity pool. Please try again.');
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setBaseToken('');
    setQuoteToken('SOL');
    setBaseAmount('');
    setQuoteAmount('');
    setStartDate('');
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-solana-green mb-8">Create Liquidity Pool</h1>
      
      <div className="mb-8 flex justify-end">
        <WalletConnectButton 
          onConnect={handleWalletConnect} 
          onDisconnect={handleWalletDisconnect} 
        />
      </div>
      
      {!walletConnected ? (
        <div className="bg-dark-blue p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Please connect your Solana wallet to create a liquidity pool.</p>
          <WalletConnectButton 
            onConnect={handleWalletConnect} 
            onDisconnect={handleWalletDisconnect} 
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-dark-blue p-6 rounded-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-solana-green mb-4">Pool Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-1">Base Token *</label>
                  {userTokens.length > 0 ? (
                    <select
                      value={baseToken}
                      onChange={(e) => setBaseToken(e.target.value)}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                    >
                      <option value="">Select your token</option>
                      {userTokens.map((token) => (
                        <option key={token.mint} value={token.mint}>
                          {token.name} ({token.symbol})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-500">
                      No tokens found in your wallet
                    </div>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Select one of your tokens</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Quote Token *</label>
                  <select
                    value={quoteToken}
                    onChange={(e) => setQuoteToken(e.target.value)}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  >
                    <option value="SOL">SOL</option>
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                  </select>
                  <p className="text-gray-500 text-xs mt-1">Token to pair with your token</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Base Amount *</label>
                  <input
                    type="number"
                    placeholder="Amount of your token"
                    value={baseAmount}
                    onChange={(e) => setBaseAmount(e.target.value)}
                    required
                    min="0"
                    step="any"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Quote Amount *</label>
                  <input
                    type="number"
                    placeholder="Amount of quote token"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    required
                    min="0"
                    step="any"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-1">Start Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                  <p className="text-gray-500 text-xs mt-1">Leave empty to start immediately</p>
                </div>
              </div>
            </div>
            
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
            
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || !walletConnected || userTokens.length === 0}
                className={`
                  px-8 py-3 rounded-lg text-white font-bold text-lg
                  ${isSubmitting || !walletConnected || userTokens.length === 0
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-solana-purple hover:bg-purple-700 transition-colors duration-300'
                  }
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span>
                    Creating Liquidity Pool...
                  </span>
                ) : userTokens.length === 0 ? (
                  'Create a token first'
                ) : (
                  'Create Liquidity Pool'
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
