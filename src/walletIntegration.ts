import { PublicKey } from '@solana/web3.js';

// Improved Phantom Wallet Integration with direct popup support
export class PhantomWalletAdapter {
  private _publicKey: PublicKey | null = null;
  private _connected: boolean = false;
  private _onDisconnect: (() => void) | null = null;

  constructor() {
    this._checkForPhantom();
    this._registerEvents();
  }

  get publicKey(): PublicKey | null {
    return this._publicKey;
  }

  get connected(): boolean {
    return this._connected;
  }

  private _checkForPhantom(): boolean {
    // Check if Phantom is available in window
    const provider = this._getProvider();
    return !!provider;
  }

  private _getProvider() {
    if ('phantom' in window) {
      return window.phantom?.solana;
    }
    
    // Fallback for older versions of Phantom
    if (window.solana?.isPhantom) {
      return window.solana;
    }
    
    return null;
  }

  private _registerEvents(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        // Check if Phantom is connected on page load
        this._checkConnection();
      });

      // Listen for account changes
      const provider = this._getProvider();
      if (provider) {
        provider.on('accountChanged', (publicKey: PublicKey | null) => {
          if (publicKey) {
            this._publicKey = publicKey;
            console.log('Account changed:', publicKey.toString());
          } else {
            this._handleDisconnect();
          }
        });

        // Listen for disconnect
        provider.on('disconnect', () => {
          this._handleDisconnect();
        });
      }
    }
  }

  private _checkConnection(): void {
    const provider = this._getProvider();
    if (provider && provider.isConnected) {
      this._publicKey = provider.publicKey;
      this._connected = true;
      console.log('Already connected to Phantom wallet:', this._publicKey?.toString());
    }
  }

  async connect(): Promise<PublicKey> {
    try {
      const provider = this._getProvider();
      
      if (!provider) {
        throw new Error('Phantom wallet not installed. Please install Phantom wallet extension.');
      }

      // This will trigger the Phantom popup
      const { publicKey } = await provider.connect();
      
      this._publicKey = publicKey;
      this._connected = true;
      
      console.log('Connected to Phantom wallet:', publicKey.toString());
      return publicKey;
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const provider = this._getProvider();
      
      if (provider) {
        await provider.disconnect();
        this._handleDisconnect();
      }
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
      throw error;
    }
  }

  private _handleDisconnect(): void {
    this._publicKey = null;
    this._connected = false;
    
    if (this._onDisconnect) {
      this._onDisconnect();
    }
    
    console.log('Disconnected from Phantom wallet');
  }

  onDisconnect(callback: () => void): void {
    this._onDisconnect = callback;
  }

  async signTransaction(transaction: any): Promise<any> {
    try {
      const provider = this._getProvider();
      
      if (!provider || !this._connected) {
        throw new Error('Wallet not connected');
      }

      const signedTransaction = await provider.signTransaction(transaction);
      return signedTransaction;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }

  async signAllTransactions(transactions: any[]): Promise<any[]> {
    try {
      const provider = this._getProvider();
      
      if (!provider || !this._connected) {
        throw new Error('Wallet not connected');
      }

      const signedTransactions = await provider.signAllTransactions(transactions);
      return signedTransactions;
    } catch (error) {
      console.error('Error signing transactions:', error);
      throw error;
    }
  }

  // Add token to Phantom wallet
  async addToken(tokenAddress: string): Promise<boolean> {
    try {
      const provider = this._getProvider();
      
      if (!provider || !this._connected) {
        throw new Error('Wallet not connected');
      }

      // This will trigger a popup in Phantom to add the token
      await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'SPL',
          options: {
            address: tokenAddress
          }
        }
      });
      
      console.log('Token added to wallet:', tokenAddress);
      return true;
    } catch (error) {
      console.error('Error adding token to wallet:', error);
      throw error;
    }
  }
}

// Add Phantom wallet type definitions
declare global {
  interface Window {
    phantom?: {
      solana?: any;
    };
    solana?: any;
  }
}

// Create a singleton instance
let phantomWalletInstance: PhantomWalletAdapter | null = null;

export function getPhantomWallet(): PhantomWalletAdapter {
  if (!phantomWalletInstance) {
    phantomWalletInstance = new PhantomWalletAdapter();
  }
  return phantomWalletInstance;
}

// Debug utilities for wallet integration
export const walletDebugger = {
  logConnectionStatus: (adapter: PhantomWalletAdapter): void => {
    console.log('Wallet connected:', adapter.connected);
    console.log('Public key:', adapter.publicKey?.toString() || 'Not connected');
  },
  
  checkPhantomInstallation: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const hasPhantomProvider = 'phantom' in window;
    const hasSolanaProvider = window.solana && window.solana.isPhantom;
    
    console.log('Phantom provider available:', hasPhantomProvider);
    console.log('Solana provider available:', hasSolanaProvider);
    
    return hasPhantomProvider || hasSolanaProvider;
  },
  
  getWalletProvider: () => {
    if (typeof window === 'undefined') return null;
    
    if ('phantom' in window) {
      return window.phantom?.solana;
    }
    
    if (window.solana?.isPhantom) {
      return window.solana;
    }
    
    return null;
  }
};
