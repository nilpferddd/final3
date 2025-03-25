import { useState, useEffect } from 'react';
import { getPhantomWallet } from '../src/walletIntegration';
import { createToken, addTokenToWallet } from '../src/tokenService';
import WalletConnectButton from '../components/WalletConnectButton';
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';

interface TokenCreationOptions {
  revokeFreeze: boolean;
  revokeMint: boolean;
  revokeUpdate: boolean;
}

export default function TokenCreationForm() {
  // Form state
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState('9');
  const [tokenSupply, setTokenSupply] = useState('1000000000');
  const [tokenDescription, setTokenDescription] = useState('');
  const [tokenImage, setTokenImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Social links
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [discord, setDiscord] = useState('');
  
  // Creator info
  const [showCreatorInfo, setShowCreatorInfo] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [creatorWebsite, setCreatorWebsite] = useState('');
  
  // Revoke options - all options can be selected simultaneously
  const [revokeOptions, setRevokeOptions] = useState<TokenCreationOptions>({
    revokeFreeze: false,
    revokeMint: false,
    revokeUpdate: false
  });
  
  // Wallet connection
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [createdToken, setCreatedToken] = useState(null);
  
  // Handle wallet connection
  const handleWalletConnect = (publicKey) => {
    setWalletConnected(true);
    setWalletPublicKey(publicKey);
    setDebugInfo(`Wallet connected: ${publicKey.toString()}`);
  };
  
  // Handle wallet disconnection
  const handleWalletDisconnect = () => {
    setWalletConnected(false);
    setWalletPublicKey(null);
    setDebugInfo('Wallet disconnected');
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTokenImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setDebugInfo(`Image uploaded: ${file.name} (${file.size} bytes)`);
    }
  };
  
  // Handle revoke options change - allow multiple selections
  const handleRevokeOptionChange = (option: keyof TokenCreationOptions) => {
    setRevokeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
    
    setDebugInfo(`Revoke option changed: ${option} = ${!revokeOptions[option]}`);
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
      setDebugInfo('Creating token...');
      
      // Validate form
      if (!tokenName || !tokenSymbol || !tokenDecimals || !tokenSupply) {
        throw new Error('Please fill in all required fields');
      }
      
      // Connect to Solana devnet
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      // For demo purposes, we'll use a generated keypair
      // In a real implementation, we would use the connected wallet to sign transactions
      const payer = Keypair.generate();
      
      // Create the token
      const tokenData = await createToken(
        connection,
        payer,
        walletPublicKey,
        parseInt(tokenDecimals),
        tokenName,
        tokenSymbol,
        parseInt(tokenSupply),
        revokeOptions
      );
      
      setCreatedToken(tokenData);
      setDebugInfo(`Token created: ${tokenData.mint}`);
      
      // Add token to wallet
      const wallet = getPhantomWallet();
      await addTokenToWallet(tokenData.mint, wallet);
      
      setSuccess(`Token ${tokenName} (${tokenSymbol}) created successfully and added to your wallet!`);
      
      // Reset form after successful submission
      // resetForm();
    } catch (err) {
      console.error('Error creating token:', err);
      setError(err.message || 'Failed to create token. Please try again.');
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Add token to wallet manually (if needed)
  const handleAddToWallet = async () => {
    if (!createdToken) {
      setError('No token created yet');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const wallet = getPhantomWallet();
      await addTokenToWallet(createdToken.mint, wallet);
      setSuccess('Token added to your wallet!');
    } catch (err) {
      console.error('Error adding token to wallet:', err);
      setError(err.message || 'Failed to add token to wallet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setTokenName('');
    setTokenSymbol('');
    setTokenDecimals('9');
    setTokenSupply('1000000000');
    setTokenDescription('');
    setTokenImage(null);
    setImagePreview('');
    setWebsite('');
    setTwitter('');
    setTelegram('');
    setDiscord('');
    setShowCreatorInfo(false);
    setCreatorName('');
    setCreatorWebsite('');
    setRevokeOptions({
      revokeFreeze: false,
      revokeMint: false,
      revokeUpdate: false
    });
    setCreatedToken(null);
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-solana-green mb-8">Create Solana Token</h1>
      
      <div className="mb-8 flex justify-end">
        <WalletConnectButton 
          onConnect={handleWalletConnect} 
          onDisconnect={handleWalletDisconnect} 
        />
      </div>
      
      {!walletConnected ? (
        <div className="bg-dark-blue p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">Please connect your Phantom wallet to create a token.</p>
          <WalletConnectButton 
            onConnect={handleWalletConnect} 
            onDisconnect={handleWalletDisconnect} 
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            <div className="bg-dark-blue p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-solana-green mb-4">Token Image</h2>
              
              <div className="mb-4">
                <div className="flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg h-64 overflow-hidden relative">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Token preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="text-5xl mb-2">🖼️</div>
                      <p className="text-gray-400">Upload Image</p>
                      <p className="text-gray-500 text-sm">Recommended: 1000x1000 PNG</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-dark-blue p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-solana-green mb-4">Social Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1">Website</label>
                  <input
                    type="url"
                    placeholder="Website URL"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Twitter</label>
                  <input
                    type="url"
                    placeholder="Twitter URL"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Telegram</label>
                  <input
                    type="url"
                    placeholder="Telegram URL"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Discord</label>
                  <input
                    type="url"
                    placeholder="Discord URL"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-dark-blue p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-solana-green mb-4">Token Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    placeholder="Token Name"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Symbol *</label>
                  <input
                    type="text"
                    placeholder="Your Token Symbol"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                    required
                    maxLength={8}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                  <p className="text-gray-500 text-xs mt-1">Max 8 characters</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Decimals *</label>
                  <input
                    type="number"
                    placeholder="Your Token Decimal"
                    value={tokenDecimals}
                    onChange={(e) => setTokenDecimals(e.target.value)}
                    required
                    min="0"
                    max="9"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                  <p className="text-gray-500 text-xs mt-1">Most meme coins use 9 decimals</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Supply *</label>
                  <input
                    type="number"
                    placeholder="Your Token Supply"
                    value={tokenSupply}
                    onChange={(e) => setTokenSupply(e.target.value)}
                    required
                    min="1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  />
                  <p className="text-gray-500 text-xs mt-1">Most meme coins use 1,000,000,000 (1B)</p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1">Description *</label>
                  <textarea
                    placeholder="Describe your token"
                    value={tokenDescription}
                    onChange={(e) => setTokenDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-blue p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-solana-green">Creator Information</h2>
                <button
                  type="button"
                  onClick={() => setShowCreatorInfo(!showCreatorInfo)}
                  className="text-solana-purple hover:text-solana-green"
                >
                  {showCreatorInfo ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showCreatorInfo && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Creator Name</label>
                    <input
                      type="text"
                      placeholder="Creator Name"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1">Creator Website</label>
                    <input
                      type="url"
                      placeholder="Creator Website"
                      value={creatorWebsite}
                      onChange={(e) => setCreatorWebsite(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                    />
                  </div>
                </div>
              )}
              
              <p className="text-gray-500 text-sm mt-2">
                By default, creator is set to "Solana Token Creator"
              </p>
            </div>
            
            <div className="bg-dark-blue p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-solana-green mb-4">Advanced Options</h2>
              
              <div>
                <h3 className="text-white mb-2">Revoke Authorities</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Solana Token has 3 authorities: Freeze Authority, Mint Authority, and Update Authority. 
                  You can revoke any or all of them to attract more investors.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">Revoke Freeze</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={revokeOptions.revokeFreeze}
                          onChange={() => handleRevokeOptionChange('revokeFreeze')}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-solana-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-solana-purple"></div>
                      </label>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Freeze Authority allows you to freeze token accounts of holders.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">+0.1 SOL</p>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">Revoke Mint</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={revokeOptions.revokeMint}
                          onChange={() => handleRevokeOptionChange('revokeMint')}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-solana-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-solana-purple"></div>
                      </label>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Mint Authority allows you to mint more supply of your token.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">+0.1 SOL</p>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">Revoke Update</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={revokeOptions.revokeUpdate}
                          onChange={() => handleRevokeOptionChange('revokeUpdate')}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-solana-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-solana-purple"></div>
                      </label>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Update Authority allows you to update the token metadata.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">+0.1 SOL</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Created Token Information */}
            {createdToken && (
              <div className="bg-green-900/30 p-6 rounded-lg border border-green-700">
                <h2 className="text-xl font-semibold text-green-400 mb-4">Token Created Successfully!</h2>
                
                <div className="space-y-2 mb-4">
                  <p className="text-gray-300">
                    <span className="font-semibold">Name:</span> {createdToken.name}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Symbol:</span> {createdToken.symbol}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Mint Address:</span> 
                    <span className="text-xs ml-2 break-all">{createdToken.mint}</span>
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold">Token Account:</span> 
                    <span className="text-xs ml-2 break-all">{createdToken.tokenAccount}</span>
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleAddToWallet}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                >
                  Add Token to Phantom Wallet
                </button>
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
            
            {success && !createdToken && (
              <div className="bg-green-900/50 text-green-200 p-4 rounded-lg">
                {success}
              </div>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || !walletConnected}
                className={`
                  px-8 py-3 rounded-lg text-white font-bold text-lg
                  ${isSubmitting || !walletConnected
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-solana-purple hover:bg-purple-700 transition-colors duration-300'
                  }
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span>
                    Creating Token...
                  </span>
                ) : (
                  'Create Token'
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
