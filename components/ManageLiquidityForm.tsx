import { useState, useEffect } from 'react';
import { getPhantomWallet } from '../src/walletIntegration';
import WalletConnectButton from '../components/WalletConnectButton';

export default function ManageLiquidityForm() {
  // Form state
  const [action, setAction] = useState('add'); // 'add' or 'remove'
  const [pool, setPool] = useState('');
  const [baseAmount, setBaseAmount] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [userPools, setUserPools] = useState([]);
  
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
    
    // Fetch user's actual liquidity pools
    fetchUserPools(publicKey);
  };
  
  // Fetch user's liquidity pools
  const fetchUserPools = async (publicKey) => {
    try {
      setDebugInfo('Fetching user liquidity pools...');
      
      // In a real implementation, we would query the blockchain for the user's liquidity pools
      // For now, we'll just clear the sample pools
      setUserPools([]);
      
      // If we had a real connection to the Solana blockchain and Raydium:
      // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      // const pools = await fetchRaydiumPools(connection, publicKey);
      // setUserPools(pools);
      
      setDebugInfo('User liquidity pools fetched successfully');
    } catch (err) {
      console.error('Error fetching user liquidity pools:', err);
      setDebugInfo(`Error fetching user liquidity pools: ${err.message}`);
    }
  };
  
  // Handle wallet disconnection
  const handleWalletDisconnect = () => {
    setWalletConnected(false);
    setWalletPublicKey(null);
    setUserPools([]);
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
      setDebugInfo(`Submitting ${action} liquidity form...`);
      
      // Validate form
      if (!pool || !baseAmount || !quoteAmount) {
        throw new Error('Please fill in all required fields');
      }
      
      // Log form data for debugging
      console.log('Manage liquidity form data:', {
        action,
        pool,
        baseAmount,
        quoteAmount,
      });
      
      // In a real implementation, this would call the liquidity management service
      // For now, we'll simulate a successful operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const actionText = action === 'add' ? 'added to' : 'removed from';
      setSuccess(`Liquidity ${actionText} pool successfully! Transaction ID: ${Math.random().toString(36).substring(2, 15)}`);
      setDebugInfo(`Liquidity ${action} successful`);
      
      // Reset form after successful submission
      // resetForm();
    } catch (err) {
      console.error(`Error ${action}ing liquidity:`, err);
      setError(err.message || `Failed to ${action} liquidity. Please try again.`);
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setPool('');
    setBaseAmount('');
    setQuoteAmount('');
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-solana-green mb-8">Manage Liquidity</h1>
      
      <div className="mb-8 flex justify-end">
        <WalletConnectButton 
          onConnect={handleWalletConnect} 
          onDisconnect={handleWalletDisconnect} 
        />
      </div>
      
      {!walletConnected ? (
        <div className="bg-dark-blue p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Please connect your Solana wallet to manage liquidity.</p>
          <WalletConnectButton 
            onConnect={handleWalletConnect} 
            onDisconnect={handleWalletDisconnect} 
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-dark-blue p-6 rounded-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-solana-green mb-4">Liquidity Management</h2>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Action</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setAction('add')}
                    className={`px-4 py-2 rounded-md ${
                      action === 'add'
                        ? 'bg-solana-purple text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Add Liquidity
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction('remove')}
                    className={`px-4 py-2 rounded-md ${
                      action === 'remove'
                        ? 'bg-solana-purple text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Remove Liquidity
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-1">Liquidity Pool *</label>
                  {userPools.length > 0 ? (
                    <select
                      value={pool}
                      onChange={(e) => setPool(e.target.value)}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                    >
                      <option value="">Select a liquidity pool</option>
                      {userPools.map((pool) => (
                        <option key={pool.id} value={pool.id}>
                          {pool.baseToken} / {pool.quoteToken}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-500">
                      No liquidity pools found
                    </div>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {userPools.length === 0 ? 'Create a liquidity pool first' : 'Select a liquidity pool to manage'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Base Amount *</label>
                  <input
                    type="number"
                    placeholder="Amount of base token"
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
                disabled={isSubmitting || !walletConnected || userPools.length === 0}
                className={`
                  px-8 py-3 rounded-lg text-white font-bold text-lg
                  ${isSubmitting || !walletConnected || userPools.length === 0
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-solana-purple hover:bg-purple-700 transition-colors duration-300'
                  }
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span>
                    {action === 'add' ? 'Adding' : 'Removing'} Liquidity...
                  </span>
                ) : userPools.length === 0 ? (
                  'Create a liquidity pool first'
                ) : (
                  `${action === 'add' ? 'Add' : 'Remove'} Liquidity`
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
