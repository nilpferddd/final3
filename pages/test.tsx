import { useEffect } from 'react';
import { initDebugTools, debugUtils } from '../src/debugUtils';
import { getPhantomWallet, walletDebugger } from '../src/walletIntegration';

export default function TestPage() {
  useEffect(() => {
    // Initialize debug tools
    initDebugTools();
    
    // Log test initialization
    debugUtils.log('Test page initialized');
    
    // Add test controls to debug console
    if (typeof window !== 'undefined') {
      (window as any).runTests = runAllTests;
    }
  }, []);
  
  const testPhantomWalletIntegration = async () => {
    debugUtils.log('Testing Phantom Wallet integration...');
    
    try {
      // Check if Phantom is installed
      const isInstalled = walletDebugger.checkPhantomInstallation();
      debugUtils.log(`Phantom wallet installed: ${isInstalled}`);
      
      if (!isInstalled) {
        debugUtils.log('Phantom wallet not installed. Please install Phantom wallet to continue testing.');
        return false;
      }
      
      // Test wallet connection
      debugUtils.log('Attempting to connect to Phantom wallet...');
      const wallet = getPhantomWallet();
      
      try {
        const publicKey = await wallet.connect();
        debugUtils.log(`Connected to wallet: ${publicKey.toString()}`);
        
        // Log connection status
        walletDebugger.logConnectionStatus(wallet);
        
        // Test disconnection
        debugUtils.log('Attempting to disconnect from wallet...');
        await wallet.disconnect();
        debugUtils.log('Disconnected from wallet');
        
        return true;
      } catch (error) {
        debugUtils.error('Error connecting to wallet', error);
        return false;
      }
    } catch (error) {
      debugUtils.error('Error testing wallet integration', error);
      return false;
    }
  };
  
  const testTokenCreationOptions = () => {
    debugUtils.log('Testing token creation options...');
    
    try {
      // Simulate token creation with all revoke options
      const tokenData = {
        name: 'Test Token',
        symbol: 'TEST',
        decimals: 9,
        supply: 1000000000,
        description: 'Test token description',
        revokeOptions: {
          revokeFreeze: true,
          revokeMint: true,
          revokeUpdate: true
        }
      };
      
      debugUtils.logTokenCreation(tokenData);
      debugUtils.log('Token creation options test successful');
      
      return true;
    } catch (error) {
      debugUtils.error('Error testing token creation options', error);
      return false;
    }
  };
  
  const testLiquidityPoolFunctions = () => {
    debugUtils.log('Testing liquidity pool functions...');
    
    try {
      // Simulate liquidity pool creation
      const poolData = {
        baseToken: 'Test Token',
        quoteToken: 'SOL',
        baseAmount: 1000,
        quoteAmount: 10
      };
      
      debugUtils.logLiquidityPoolOperation('create', poolData);
      
      // Simulate adding liquidity
      const addData = {
        poolId: 'test_pool_id',
        baseAmount: 500,
        quoteAmount: 5
      };
      
      debugUtils.logLiquidityPoolOperation('add', addData);
      
      // Simulate removing liquidity
      const removeData = {
        poolId: 'test_pool_id',
        baseAmount: 200,
        quoteAmount: 2
      };
      
      debugUtils.logLiquidityPoolOperation('remove', removeData);
      
      debugUtils.log('Liquidity pool functions test successful');
      
      return true;
    } catch (error) {
      debugUtils.error('Error testing liquidity pool functions', error);
      return false;
    }
  };
  
  const testDebugFunctions = () => {
    debugUtils.log('Testing debug functions...');
    
    try {
      // Test different log types
      debugUtils.log('This is a regular log');
      debugUtils.error('This is an error log');
      
      // Test transaction logging
      debugUtils.logTransaction('test_transaction_id', 'token_creation');
      
      // Test debug element
      debugUtils.createDebugElement();
      debugUtils.appendToDebugElement('Test message in debug console');
      
      debugUtils.log('Debug functions test successful');
      
      return true;
    } catch (error) {
      console.error('Error testing debug functions:', error);
      return false;
    }
  };
  
  const runAllTests = async () => {
    debugUtils.log('Running all tests...');
    
    const results = {
      walletIntegration: await testPhantomWalletIntegration(),
      tokenCreationOptions: testTokenCreationOptions(),
      liquidityPoolFunctions: testLiquidityPoolFunctions(),
      debugFunctions: testDebugFunctions()
    };
    
    const allPassed = Object.values(results).every(result => result === true);
    
    if (allPassed) {
      debugUtils.log('All tests passed successfully! ✅');
    } else {
      debugUtils.error('Some tests failed ❌', results);
    }
    
    return results;
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-solana-green mb-8">Test Page</h1>
      
      <div className="bg-dark-blue p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Phantom Wallet Integration Test</h2>
        <p className="text-gray-300 mb-4">
          This page allows you to test the Phantom Wallet integration and other functionality.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={testPhantomWalletIntegration}
            className="w-full bg-solana-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Test Wallet Integration
          </button>
          
          <button
            onClick={testTokenCreationOptions}
            className="w-full bg-solana-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Test Token Creation Options
          </button>
          
          <button
            onClick={testLiquidityPoolFunctions}
            className="w-full bg-solana-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Test Liquidity Pool Functions
          </button>
          
          <button
            onClick={testDebugFunctions}
            className="w-full bg-solana-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Test Debug Functions
          </button>
          
          <button
            onClick={runAllTests}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            Run All Tests
          </button>
        </div>
      </div>
      
      <div className="bg-dark-blue p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Debug Console</h2>
        <p className="text-gray-300 mb-4">
          Press <kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl+Shift+D</kbd> to toggle the debug console.
        </p>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <h3 className="text-white font-medium mb-2">Console Commands</h3>
          <pre className="text-gray-400 text-xs overflow-auto max-h-40">
{`// Run all tests
window.runTests()

// Access debug utilities
window.solanaTokenDebug.log('Custom message')
window.solanaTokenDebug.toggleDebugConsole()

// Check wallet status
window.solanaTokenDebug.log(getPhantomWallet().connected)
`}
          </pre>
        </div>
      </div>
    </div>
  );
}
