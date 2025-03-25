import { useState, useEffect } from 'react';
import { getPhantomWallet, walletDebugger } from '../src/walletIntegration';
import { Connection, clusterApiUrl } from '@solana/web3.js';

export default function TestWalletIntegration() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState(null);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Check if Phantom is installed
    const checkPhantomInstallation = () => {
      const isInstalled = walletDebugger.checkPhantomInstallation();
      setIsPhantomInstalled(isInstalled);
      addLog(`Phantom wallet installed: ${isInstalled}`);
    };
    
    checkPhantomInstallation();
  }, []);

  const addLog = (message) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      addLog('Attempting to connect to Phantom wallet...');
      
      const wallet = getPhantomWallet();
      const publicKey = await wallet.connect();
      
      setWalletConnected(true);
      setWalletPublicKey(publicKey.toString());
      
      addLog(`Connected to wallet: ${publicKey.toString()}`);
      
      setTestResults(prev => ({
        ...prev,
        walletConnection: 'PASS'
      }));
    } catch (err) {
      addLog(`Error connecting to wallet: ${err.message}`);
      setTestResults(prev => ({
        ...prev,
        walletConnection: 'FAIL'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setIsLoading(true);
      addLog('Attempting to disconnect from wallet...');
      
      const wallet = getPhantomWallet();
      await wallet.disconnect();
      
      setWalletConnected(false);
      setWalletPublicKey(null);
      
      addLog('Disconnected from wallet');
      
      setTestResults(prev => ({
        ...prev,
        walletDisconnection: 'PASS'
      }));
    } catch (err) {
      addLog(`Error disconnecting from wallet: ${err.message}`);
      setTestResults(prev => ({
        ...prev,
        walletDisconnection: 'FAIL'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testAddToken = async () => {
    try {
      setIsLoading(true);
      
      if (!walletConnected) {
        addLog('Please connect your wallet first');
        return;
      }
      
      addLog('Testing add token to wallet functionality...');
      
      // Use a known token address for testing
      // This is the USDC token on Solana devnet
      const testTokenAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
      
      const wallet = getPhantomWallet();
      await wallet.addToken(testTokenAddress);
      
      addLog(`Token added to wallet: ${testTokenAddress}`);
      
      setTestResults(prev => ({
        ...prev,
        addToken: 'PASS'
      }));
    } catch (err) {
      addLog(`Error adding token to wallet: ${err.message}`);
      setTestResults(prev => ({
        ...prev,
        addToken: 'FAIL'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testPopupFunctionality = async () => {
    try {
      setIsLoading(true);
      addLog('Testing popup functionality...');
      
      // First disconnect if already connected
      if (walletConnected) {
        const wallet = getPhantomWallet();
        await wallet.disconnect();
        setWalletConnected(false);
        setWalletPublicKey(null);
        addLog('Disconnected from wallet for popup test');
      }
      
      // Now try to connect, which should trigger the popup
      addLog('Triggering Phantom wallet popup...');
      const wallet = getPhantomWallet();
      
      // This should trigger the popup
      const publicKey = await wallet.connect();
      
      setWalletConnected(true);
      setWalletPublicKey(publicKey.toString());
      
      addLog(`Popup test successful, connected to: ${publicKey.toString()}`);
      
      setTestResults(prev => ({
        ...prev,
        popupFunctionality: 'PASS'
      }));
    } catch (err) {
      addLog(`Error testing popup functionality: ${err.message}`);
      setTestResults(prev => ({
        ...prev,
        popupFunctionality: 'FAIL'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    try {
      setIsLoading(true);
      clearLogs();
      setTestResults({});
      
      addLog('Running all wallet integration tests...');
      
      // Test 1: Check if Phantom is installed
      const isInstalled = walletDebugger.checkPhantomInstallation();
      setIsPhantomInstalled(isInstalled);
      addLog(`Phantom wallet installed: ${isInstalled}`);
      
      setTestResults(prev => ({
        ...prev,
        phantomInstallation: isInstalled ? 'PASS' : 'FAIL'
      }));
      
      if (!isInstalled) {
        addLog('Cannot proceed with tests. Please install Phantom wallet.');
        return;
      }
      
      // Test 2: Connect to wallet
      await connectWallet();
      
      // Test 3: Test popup functionality
      await testPopupFunctionality();
      
      // Test 4: Test add token functionality
      await testAddToken();
      
      // Test 5: Disconnect from wallet
      await disconnectWallet();
      
      addLog('All tests completed!');
    } catch (err) {
      addLog(`Error running tests: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-solana-green mb-8">Wallet Integration Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-dark-blue p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-solana-green mb-4">Wallet Status</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 mb-1">Phantom Installed:</p>
                <p className="text-white font-medium">
                  {isPhantomInstalled ? (
                    <span className="text-green-400">Yes ✓</span>
                  ) : (
                    <span className="text-red-400">No ✗</span>
                  )}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 mb-1">Wallet Connected:</p>
                <p className="text-white font-medium">
                  {walletConnected ? (
                    <span className="text-green-400">Yes ✓</span>
                  ) : (
                    <span className="text-red-400">No ✗</span>
                  )}
                </p>
              </div>
              
              {walletConnected && walletPublicKey && (
                <div>
                  <p className="text-gray-400 mb-1">Wallet Address:</p>
                  <p className="text-white font-medium text-xs break-all">
                    {walletPublicKey}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-dark-blue p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-solana-green mb-4">Test Actions</h2>
            
            <div className="space-y-4">
              <button
                onClick={connectWallet}
                disabled={isLoading || !isPhantomInstalled || walletConnected}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  isLoading || !isPhantomInstalled || walletConnected
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-solana-purple text-white hover:bg-purple-700 transition-colors'
                }`}
              >
                Connect Wallet
              </button>
              
              <button
                onClick={disconnectWallet}
                disabled={isLoading || !walletConnected}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  isLoading || !walletConnected
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 transition-colors'
                }`}
              >
                Disconnect Wallet
              </button>
              
              <button
                onClick={testPopupFunctionality}
                disabled={isLoading || !isPhantomInstalled}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  isLoading || !isPhantomInstalled
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                }`}
              >
                Test Popup Functionality
              </button>
              
              <button
                onClick={testAddToken}
                disabled={isLoading || !walletConnected}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  isLoading || !walletConnected
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 transition-colors'
                }`}
              >
                Test Add Token to Wallet
              </button>
              
              <button
                onClick={runAllTests}
                disabled={isLoading || !isPhantomInstalled}
                className={`w-full py-3 px-4 rounded-md font-bold ${
                  isLoading || !isPhantomInstalled
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-solana-green text-white hover:bg-green-600 transition-colors'
                }`}
              >
                Run All Tests
              </button>
            </div>
          </div>
          
          <div className="bg-dark-blue p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-solana-green mb-4">Test Results</h2>
            
            <div className="space-y-2">
              {Object.keys(testResults).length > 0 ? (
                Object.entries(testResults).map(([test, result]) => (
                  <div key={test} className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300 capitalize">{test.replace(/([A-Z])/g, ' $1')}</span>
                    <span className={result === 'PASS' ? 'text-green-400' : 'text-red-400'}>
                      {result}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No tests run yet</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-dark-blue p-6 rounded-lg h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-solana-green">Test Logs</h2>
              <button
                onClick={clearLogs}
                disabled={isLoading || logs.length === 0}
                className={`text-sm py-1 px-3 rounded-md ${
                  isLoading || logs.length === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors'
                }`}
              >
                Clear Logs
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 h-[500px] overflow-y-auto">
              {logs.length > 0 ? (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-gray-500">[{log.time}]</span>{' '}
                      <span className="text-gray-300">{log.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No logs yet</p>
              )}
            </div>
          </div>
          
          <div className="bg-dark-blue p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-solana-green mb-4">Instructions</h2>
            
            <div className="space-y-4 text-gray-300">
              <p>
                This page allows you to test the Phantom wallet integration. Follow these steps:
              </p>
              
              <ol className="list-decimal list-inside space-y-2">
                <li>Make sure you have the Phantom wallet extension installed in your browser</li>
                <li>Click "Connect Wallet" to connect to your Phantom wallet</li>
                <li>Test the popup functionality by clicking "Test Popup Functionality"</li>
                <li>Test adding a token to your wallet by clicking "Test Add Token to Wallet"</li>
                <li>Disconnect your wallet when done by clicking "Disconnect Wallet"</li>
              </ol>
              
              <p>
                You can also run all tests at once by clicking "Run All Tests".
              </p>
              
              <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700/50">
                <p className="text-yellow-300 font-medium">Note:</p>
                <p className="text-gray-300 text-sm mt-1">
                  The "Test Add Token to Wallet" function will attempt to add USDC token to your wallet.
                  This is just for testing purposes and will trigger a popup in your Phantom wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
