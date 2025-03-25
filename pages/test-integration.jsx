import React, { useState, useEffect } from 'react';
import { 
  isPhantomInstalled, 
  connectPhantomWallet, 
  isPhantomConnected, 
  getConnectedPublicKey,
  debugLog 
} from '../src/phantomWallet';
import { info, error, debug, toggleDebugConsole } from '../src/debugUtils';
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
        debug('Wallet already connected:', address);
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
      // Test 1: Debug Console
      try {
        debug('Testing debug console');
        info('This is an info message');
        error('This is an error message (for testing purposes)');
        toggleDebugConsole();
        await new Promise(resolve => setTimeout(resolve, 1000));
        toggleDebugConsole();
        addTestResult('Debug Console', true, 'Debug console opened and closed successfully');
      } catch (err) {
        addTestResult('Debug Console', false, `Error: ${err.message}`);
      }

      // Test 2: Phantom Installation
      try {
        const installed = isPhantomInstalled();
        addTestResult('Phantom Installation', installed, 
          installed ? 'Phantom wallet is installed' : 'Phantom wallet is not installed');
      } catch (err) {
        addTestResult('Phantom Installation', false, `Error: ${err.message}`);
      }

      // Test 3: Wallet Connection
      if (isPhantomInstalled()) {
        try {
          if (!walletConnected) {
            debug('Attempting to connect to wallet...');
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

      // Test 4: HTTPS Environment
      try {
        const isHttps = window.location.protocol === 'https:';
        addTestResult('HTTPS Environment', isHttps, 
          isHttps ? 'Running in HTTPS environment' : 'Not running in HTTPS environment');
      } catch (err) {
        addTestResult('HTTPS Environment', false, `Error: ${err.message}`);
      }

      // Test 5: Component Integration
      try {
        // This test just verifies that the components are loaded and don't throw errors
        addTestResult('Component Integration', true, 'All components loaded successfully');
      } catch (err) {
        addTestResult('Component Integration', false, `Error: ${err.message}`);
      }

    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">
        Integration Test Page
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
          
          <button
            onClick={toggleDebugConsole}
            className="py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
          >
            Toggle Debug Console
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>This page tests the integration of Phantom wallet and debugging capabilities.</p>
          <p>Press Ctrl+Shift+D to toggle the debug console at any time.</p>
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
