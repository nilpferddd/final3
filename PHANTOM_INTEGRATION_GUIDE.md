# Phantom Wallet Integration Guide

This guide explains how to properly integrate the Phantom wallet into your Solana token creation application, ensuring that the popup functionality works correctly.

## Files Included

1. `src/phantomWallet.js` - Core wallet integration functions
2. `src/phantomWalletTest.js` - Test script for wallet functionality
3. `pages/minimal-phantom-example.js` - Minimal working example with UI
4. `pages/test-phantom-popup.js` - Test page for popup functionality

## Installation Instructions

1. Copy these files into your existing project structure
2. Make sure you have the required dependencies:
   ```bash
   npm install @solana/web3.js
   ```
3. Update your package.json to include the scripts:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start"
   }
   ```

## How to Use the Phantom Wallet Integration

### Basic Usage

Import the functions from `phantomWallet.js`:

```javascript
import {
  isPhantomInstalled,
  connectPhantomWallet,
  disconnectPhantomWallet,
  addTokenToPhantomWallet
} from '../src/phantomWallet';

// Check if Phantom is installed
const installed = isPhantomInstalled();

// Connect to wallet (this will trigger the popup)
const publicKey = await connectPhantomWallet();

// Add a token to the wallet
await addTokenToPhantomWallet(tokenAddress);

// Disconnect from wallet
await disconnectPhantomWallet();
```

### Testing the Integration

1. Navigate to `/test-phantom-popup` in your application
2. Open your browser console (F12)
3. Click "Run Popup Tests" and follow the instructions
4. Check the console for test results

Alternatively, visit `/minimal-phantom-example` for an interactive example.

## Troubleshooting

If the popup doesn't appear:

1. Make sure Phantom wallet extension is installed
2. Check if popups are blocked by your browser
3. Verify that you're using HTTPS or localhost (Phantom won't inject on HTTP)
4. Check the browser console for errors

## Integration with Your Token Creation App

To integrate with your existing token creation application:

1. Replace any existing wallet connection code with calls to `connectPhantomWallet()`
2. Use `addTokenToPhantomWallet(tokenAddress)` after creating a new token
3. Add proper error handling for cases when the user rejects the connection

Example integration:

```javascript
import { connectPhantomWallet, addTokenToPhantomWallet } from '../src/phantomWallet';

// In your token creation component:
async function createToken() {
  try {
    // Connect wallet first (shows popup)
    const publicKey = await connectPhantomWallet();
    
    // Create token using your existing logic
    const tokenAddress = await yourTokenCreationFunction();
    
    // Add the new token to the wallet (shows popup)
    await addTokenToPhantomWallet(tokenAddress);
    
    // Show success message
    console.log('Token created and added to wallet!');
  } catch (error) {
    console.error('Error:', error);
    // Handle errors appropriately
  }
}
```

## Important Notes

- The Phantom wallet must be installed in the user's browser
- The popup will only appear when `connectPhantomWallet()` is called
- The user must approve the connection request in the popup
- After the first approval, the application is whitelisted for future connections
- The wallet integration works on both desktop and mobile browsers with Phantom installed

For any further questions or issues, please refer to the official Phantom documentation: https://docs.phantom.com/solana/
