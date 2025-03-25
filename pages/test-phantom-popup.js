import React from 'react';
import runTests from '../src/phantomWalletTest';

export default function TestPhantomPopup() {
  const handleRunTests = () => {
    runTests()
      .then(() => console.log('Tests completed'))
      .catch(err => console.error('Test error:', err));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">
          Phantom Wallet Popup Test
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Test Instructions</h2>
          
          <div className="space-y-4">
            <p>
              This page tests the Phantom wallet popup functionality. Follow these steps:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Make sure you have the Phantom wallet browser extension installed</li>
              <li>Open your browser console (F12 or right-click → Inspect → Console)</li>
              <li>Click the "Run Popup Tests" button below</li>
              <li>Watch for Phantom popups and follow the instructions in the console</li>
              <li>Check the console for test results</li>
            </ol>
            
            <div className="bg-yellow-900/30 border border-yellow-800/50 p-4 rounded-lg mt-4">
              <p className="text-yellow-300 font-medium">Important:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                <li>You must have the Phantom wallet extension installed</li>
                <li>You will see multiple popups during the test</li>
                <li>Test results will appear in the browser console</li>
                <li>If popups don't appear, check if they're blocked by your browser</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleRunTests}
            className="py-4 px-8 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg transition-colors"
          >
            Run Popup Tests
          </button>
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Alternative Test Options</h2>
          
          <div className="space-y-4">
            <p>
              If you prefer a more interactive testing experience, you can also try:
            </p>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <a 
                href="/minimal-phantom-example" 
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-center"
              >
                Try Minimal Example
              </a>
              
              <a 
                href="https://phantom.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors text-center"
              >
                Install Phantom Wallet
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
