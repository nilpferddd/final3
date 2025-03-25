/**
 * Test script for Phantom wallet popup functionality
 * This script tests various scenarios to ensure the popup works reliably
 */

// Import the wallet integration functions
import {
  isPhantomInstalled,
  getPhantomProvider,
  connectPhantomWallet,
  disconnectPhantomWallet,
  addTokenToPhantomWallet,
  setupPhantomEventListeners,
  isPhantomConnected,
  getConnectedPublicKey
} from './phantomWallet';

/**
 * Run all tests for Phantom wallet integration
 */
async function runTests() {
  console.log('=== PHANTOM WALLET INTEGRATION TESTS ===');
  
  // Test 1: Check if Phantom is installed
  console.log('\n1. Testing Phantom installation detection:');
  const installed = isPhantomInstalled();
  console.log(`   Phantom installed: ${installed ? 'YES ✓' : 'NO ✗'}`);
  
  if (!installed) {
    console.error('   ERROR: Phantom wallet is not installed. Please install it from https://phantom.app/');
    console.log('\n=== TESTS ABORTED ===');
    return;
  }
  
  // Test 2: Get Phantom provider
  console.log('\n2. Testing provider retrieval:');
  const provider = getPhantomProvider();
  console.log(`   Provider retrieved: ${provider ? 'YES ✓' : 'NO ✗'}`);
  
  if (!provider) {
    console.error('   ERROR: Could not retrieve Phantom provider');
    console.log('\n=== TESTS ABORTED ===');
    return;
  }
  
  // Test 3: Check initial connection state
  console.log('\n3. Testing initial connection state:');
  const initiallyConnected = isPhantomConnected();
  console.log(`   Initially connected: ${initiallyConnected ? 'YES' : 'NO'}`);
  
  if (initiallyConnected) {
    const pubKey = getConnectedPublicKey();
    console.log(`   Connected to: ${pubKey}`);
  }
  
  // Test 4: Setup event listeners
  console.log('\n4. Setting up event listeners:');
  const removeListeners = setupPhantomEventListeners({
    onConnect: (publicKey) => {
      console.log(`   Event - Connected: ${publicKey?.toString()}`);
    },
    onDisconnect: () => {
      console.log('   Event - Disconnected');
    },
    onAccountChange: (publicKey) => {
      if (publicKey) {
        console.log(`   Event - Account changed: ${publicKey.toString()}`);
      } else {
        console.log('   Event - Account changed but no public key provided');
      }
    }
  });
  console.log('   Event listeners set up ✓');
  
  // Test 5: Connect to wallet (should trigger popup)
  console.log('\n5. Testing wallet connection (POPUP EXPECTED):');
  try {
    console.log('   Attempting to connect to wallet...');
    const pubKey = await connectPhantomWallet();
    console.log(`   Connection successful! ✓`);
    console.log(`   Connected to: ${pubKey}`);
  } catch (error) {
    console.error(`   ERROR: ${error.message}`);
    if (error.code === 4001) {
      console.log('   User rejected the connection request (this is expected if you clicked "Cancel")');
    } else {
      console.error('   Unexpected error during connection');
    }
  }
  
  // Test 6: Check connection state after connect attempt
  console.log('\n6. Testing connection state after connect attempt:');
  const connectedAfterAttempt = isPhantomConnected();
  console.log(`   Connected: ${connectedAfterAttempt ? 'YES ✓' : 'NO ✗'}`);
  
  if (connectedAfterAttempt) {
    const pubKey = getConnectedPublicKey();
    console.log(`   Connected to: ${pubKey}`);
  } else {
    console.log('   Not connected (user may have rejected the request)');
  }
  
  // Test 7: Add token to wallet (if connected)
  if (connectedAfterAttempt) {
    console.log('\n7. Testing adding token to wallet (POPUP EXPECTED):');
    try {
      // Using USDC token address on Solana as an example
      const tokenAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
      console.log(`   Attempting to add token: ${tokenAddress}`);
      await addTokenToPhantomWallet(tokenAddress);
      console.log('   Token add request successful! ✓');
    } catch (error) {
      console.error(`   ERROR: ${error.message}`);
      if (error.code === 4001) {
        console.log('   User rejected the token add request (this is expected if you clicked "Cancel")');
      } else {
        console.error('   Unexpected error during token add');
      }
    }
  }
  
  // Test 8: Disconnect from wallet
  if (connectedAfterAttempt) {
    console.log('\n8. Testing wallet disconnection:');
    try {
      console.log('   Attempting to disconnect from wallet...');
      await disconnectPhantomWallet();
      console.log('   Disconnection successful! ✓');
    } catch (error) {
      console.error(`   ERROR: ${error.message}`);
    }
  }
  
  // Test 9: Check connection state after disconnect
  console.log('\n9. Testing connection state after disconnect:');
  const connectedAfterDisconnect = isPhantomConnected();
  console.log(`   Connected: ${connectedAfterDisconnect ? 'YES (unexpected)' : 'NO ✓'}`);
  
  // Test 10: Connect again to verify popup appears consistently
  console.log('\n10. Testing wallet connection again (POPUP EXPECTED):');
  try {
    console.log('   Attempting to connect to wallet again...');
    const pubKey = await connectPhantomWallet();
    console.log(`   Connection successful! ✓`);
    console.log(`   Connected to: ${pubKey}`);
  } catch (error) {
    console.error(`   ERROR: ${error.message}`);
    if (error.code === 4001) {
      console.log('   User rejected the connection request (this is expected if you clicked "Cancel")');
    } else {
      console.error('   Unexpected error during connection');
    }
  }
  
  // Clean up
  removeListeners();
  console.log('\n=== TESTS COMPLETED ===');
}

// Export the test function
export default runTests;
