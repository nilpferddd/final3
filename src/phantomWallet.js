/**
 * Phantom Wallet Integration Module
 * Based on official Phantom documentation: https://docs.phantom.com/solana/
 */

// Debug flag - set to true to enable detailed logging
const DEBUG = true;

/**
 * Log debug messages if debug mode is enabled
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
export const debugLog = (message, data = null) => {
  if (DEBUG) {
    if (data) {
      console.log(`[PHANTOM] ${message}`, data);
    } else {
      console.log(`[PHANTOM] ${message}`);
    }
  }
};

/**
 * Detects if Phantom wallet is installed
 * @returns {boolean} True if Phantom is installed
 */
export const isPhantomInstalled = () => {
  if (typeof window !== 'undefined') {
    const isInstalled = window?.phantom?.solana?.isPhantom || false;
    debugLog(`Phantom installed: ${isInstalled}`);
    return isInstalled;
  }
  return false;
};

/**
 * Gets the Phantom provider if it exists
 * @returns {Object|null} The Phantom provider or null if not found
 */
export const getPhantomProvider = () => {
  if (typeof window !== 'undefined' && window.phantom?.solana) {
    debugLog('Phantom provider retrieved');
    return window.phantom.solana;
  }
  debugLog('Phantom provider not found');
  return null;
};

/**
 * Connects to Phantom wallet and returns the public key
 * @returns {Promise<string>} The public key of the connected wallet
 * @throws {Error} If connection fails or is rejected
 */
export const connectPhantomWallet = async () => {
  try {
    const provider = getPhantomProvider();
    
    if (!provider) {
      debugLog('Phantom wallet not installed, opening installation page');
      window.open('https://phantom.app/', '_blank');
      throw new Error('Phantom wallet not installed. Please install it from phantom.app');
    }
    
    debugLog('Requesting connection to Phantom wallet...');
    const response = await provider.connect();
    debugLog('Connection successful!', response);
    
    return response.publicKey.toString();
  } catch (error) {
    debugLog('Error connecting to Phantom wallet:', error);
    throw error;
  }
};

/**
 * Disconnects from Phantom wallet
 * @returns {Promise<void>}
 */
export const disconnectPhantomWallet = async () => {
  try {
    const provider = getPhantomProvider();
    
    if (provider) {
      debugLog('Disconnecting from Phantom wallet...');
      await provider.disconnect();
      debugLog('Disconnected from Phantom wallet');
    }
  } catch (error) {
    debugLog('Error disconnecting from Phantom wallet:', error);
    throw error;
  }
};

/**
 * Adds a token to the Phantom wallet
 * @param {string} tokenAddress - The address of the token to add
 * @returns {Promise<void>}
 */
export const addTokenToPhantomWallet = async (tokenAddress) => {
  try {
    const provider = getPhantomProvider();
    
    if (!provider) {
      throw new Error('Phantom wallet not installed');
    }
    
    debugLog(`Adding token to wallet: ${tokenAddress}`);
    await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'SPL',
        options: {
          address: tokenAddress
        }
      }
    });
    
    debugLog('Token added to wallet:', tokenAddress);
  } catch (error) {
    debugLog('Error adding token to wallet:', error);
    throw error;
  }
};

/**
 * Sets up event listeners for Phantom wallet events
 * @param {Object} callbacks - Callback functions for different events
 * @returns {Function} Function to remove event listeners
 */
export const setupPhantomEventListeners = (callbacks = {}) => {
  const provider = getPhantomProvider();
  
  if (!provider) {
    debugLog('Cannot set up event listeners: Phantom wallet not installed');
    return () => {};
  }
  
  debugLog('Setting up Phantom wallet event listeners');
  
  // Connect event
  if (callbacks.onConnect) {
    provider.on('connect', callbacks.onConnect);
    debugLog('Connect event listener added');
  }
  
  // Disconnect event
  if (callbacks.onDisconnect) {
    provider.on('disconnect', callbacks.onDisconnect);
    debugLog('Disconnect event listener added');
  }
  
  // Account change event
  if (callbacks.onAccountChange) {
    provider.on('accountChanged', callbacks.onAccountChange);
    debugLog('Account change event listener added');
  }
  
  // Return function to remove event listeners
  return () => {
    debugLog('Removing Phantom wallet event listeners');
    if (callbacks.onConnect) provider.removeListener('connect', callbacks.onConnect);
    if (callbacks.onDisconnect) provider.removeListener('disconnect', callbacks.onDisconnect);
    if (callbacks.onAccountChange) provider.removeListener('accountChanged', callbacks.onAccountChange);
  };
};

/**
 * Checks if the wallet is connected
 * @returns {boolean} True if connected
 */
export const isPhantomConnected = () => {
  const provider = getPhantomProvider();
  const connected = provider?.isConnected || false;
  debugLog(`Wallet connected: ${connected}`);
  return connected;
};

/**
 * Gets the public key of the connected wallet
 * @returns {string|null} The public key or null if not connected
 */
export const getConnectedPublicKey = () => {
  const provider = getPhantomProvider();
  const publicKey = provider?.publicKey?.toString() || null;
  debugLog(`Connected public key: ${publicKey}`);
  return publicKey;
};

/**
 * Signs a transaction using Phantom wallet
 * @param {Transaction} transaction - The transaction to sign
 * @returns {Promise<Transaction>} The signed transaction
 */
export const signTransaction = async (transaction) => {
  try {
    const provider = getPhantomProvider();
    
    if (!provider) {
      throw new Error('Phantom wallet not installed');
    }
    
    debugLog('Signing transaction...');
    const signedTransaction = await provider.signTransaction(transaction);
    debugLog('Transaction signed successfully');
    
    return signedTransaction;
  } catch (error) {
    debugLog('Error signing transaction:', error);
    throw error;
  }
};

/**
 * Signs and sends a transaction using Phantom wallet
 * @param {Transaction} transaction - The transaction to sign and send
 * @returns {Promise<string>} The transaction signature
 */
export const signAndSendTransaction = async (transaction) => {
  try {
    const provider = getPhantomProvider();
    
    if (!provider) {
      throw new Error('Phantom wallet not installed');
    }
    
    debugLog('Signing and sending transaction...');
    const { signature } = await provider.signAndSendTransaction(transaction);
    debugLog('Transaction sent successfully:', signature);
    
    return signature;
  } catch (error) {
    debugLog('Error signing and sending transaction:', error);
    throw error;
  }
};

/**
 * Toggles debug mode
 * @param {boolean} enabled - Whether to enable debug mode
 */
export const setDebugMode = (enabled) => {
  if (typeof window !== 'undefined') {
    window.PHANTOM_DEBUG = enabled;
    debugLog(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }
};

/**
 * Gets the current debug status
 * @returns {boolean} Whether debug mode is enabled
 */
export const isDebugMode = () => {
  if (typeof window !== 'undefined') {
    return window.PHANTOM_DEBUG || DEBUG;
  }
  return DEBUG;
};

/**
 * Opens the debug console
 */
export const openDebugConsole = () => {
  if (typeof window !== 'undefined') {
    if (!window.phantomDebugConsole) {
      // Create debug console element
      const consoleDiv = document.createElement('div');
      consoleDiv.id = 'phantom-debug-console';
      consoleDiv.style.position = 'fixed';
      consoleDiv.style.bottom = '0';
      consoleDiv.style.right = '0';
      consoleDiv.style.width = '400px';
      consoleDiv.style.height = '300px';
      consoleDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      consoleDiv.style.color = '#00ff00';
      consoleDiv.style.padding = '10px';
      consoleDiv.style.fontFamily = 'monospace';
      consoleDiv.style.fontSize = '12px';
      consoleDiv.style.overflowY = 'auto';
      consoleDiv.style.zIndex = '9999';
      consoleDiv.style.border = '1px solid #333';
      consoleDiv.style.borderRadius = '5px 0 0 0';
      
      // Add header
      const header = document.createElement('div');
      header.style.borderBottom = '1px solid #333';
      header.style.paddingBottom = '5px';
      header.style.marginBottom = '5px';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.innerHTML = '<span>Phantom Wallet Debug Console</span>';
      
      // Add close button
      const closeButton = document.createElement('button');
      closeButton.innerText = 'X';
      closeButton.style.backgroundColor = 'transparent';
      closeButton.style.border = 'none';
      closeButton.style.color = 'white';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => {
        document.body.removeChild(consoleDiv);
        window.phantomDebugConsole = null;
      };
      header.appendChild(closeButton);
      
      // Add content area
      const content = document.createElement('div');
      content.id = 'phantom-debug-content';
      
      consoleDiv.appendChild(header);
      consoleDiv.appendChild(content);
      document.body.appendChild(consoleDiv);
      
      // Store reference
      window.phantomDebugConsole = consoleDiv;
      
      // Log initial message
      addDebugMessage('Debug console initialized');
    } else {
      // Show existing console
      window.phantomDebugConsole.style.display = 'block';
    }
  }
};

/**
 * Adds a message to the debug console
 * @param {string} message - Message to add
 */
export const addDebugMessage = (message) => {
  if (typeof window !== 'undefined' && window.phantomDebugConsole) {
    const content = document.getElementById('phantom-debug-content');
    const entry = document.createElement('div');
    entry.style.marginBottom = '3px';
    entry.style.wordBreak = 'break-all';
    
    const timestamp = new Date().toLocaleTimeString();
    entry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> ${message}`;
    
    content.appendChild(entry);
    content.scrollTop = content.scrollHeight;
  }
};

// Initialize keyboard shortcut for debug console
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    // Ctrl+Shift+P to toggle debug console
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      if (window.phantomDebugConsole) {
        document.body.removeChild(window.phantomDebugConsole);
        window.phantomDebugConsole = null;
      } else {
        openDebugConsole();
      }
    }
  });
}

// Export a default object with all functions
export default {
  isPhantomInstalled,
  getPhantomProvider,
  connectPhantomWallet,
  disconnectPhantomWallet,
  addTokenToPhantomWallet,
  setupPhantomEventListeners,
  isPhantomConnected,
  getConnectedPublicKey,
  signTransaction,
  signAndSendTransaction,
  setDebugMode,
  isDebugMode,
  openDebugConsole,
  addDebugMessage,
  debugLog
};
