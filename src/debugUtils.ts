// Debug utilities for the entire application
export const debugUtils = {
  // General debugging
  log: (message: string, data?: any): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },
  
  error: (message: string, error?: any): void => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },
  
  // Token creation debugging
  logTokenCreation: (tokenData: any): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[TOKEN CREATION]', tokenData);
    }
  },
  
  // Liquidity pool debugging
  logLiquidityPoolOperation: (operation: string, poolData: any): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LIQUIDITY POOL ${operation.toUpperCase()}]`, poolData);
    }
  },
  
  // Transaction debugging
  logTransaction: (txId: string, type: string): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[TRANSACTION ${type.toUpperCase()}] ID: ${txId}`);
    }
  },
  
  // DOM element for debug output
  createDebugElement: (): HTMLElement | null => {
    if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
      let debugElement = document.getElementById('solana-token-debug');
      
      if (!debugElement) {
        debugElement = document.createElement('div');
        debugElement.id = 'solana-token-debug';
        debugElement.style.position = 'fixed';
        debugElement.style.bottom = '10px';
        debugElement.style.right = '10px';
        debugElement.style.width = '300px';
        debugElement.style.maxHeight = '200px';
        debugElement.style.overflowY = 'auto';
        debugElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        debugElement.style.color = '#00ff00';
        debugElement.style.padding = '10px';
        debugElement.style.borderRadius = '5px';
        debugElement.style.fontFamily = 'monospace';
        debugElement.style.fontSize = '12px';
        debugElement.style.zIndex = '9999';
        
        const header = document.createElement('div');
        header.textContent = 'Debug Console';
        header.style.borderBottom = '1px solid #00ff00';
        header.style.marginBottom = '5px';
        header.style.paddingBottom = '5px';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.float = 'right';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.color = '#00ff00';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
          debugElement?.remove();
        };
        
        header.appendChild(closeButton);
        debugElement.appendChild(header);
        
        const content = document.createElement('div');
        content.id = 'solana-token-debug-content';
        debugElement.appendChild(content);
        
        document.body.appendChild(debugElement);
      }
      
      return debugElement;
    }
    
    return null;
  },
  
  appendToDebugElement: (message: string): void => {
    if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
      const debugElement = debugUtils.createDebugElement();
      const content = document.getElementById('solana-token-debug-content');
      
      if (content) {
        const entry = document.createElement('div');
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        entry.style.borderBottom = '1px dotted #333';
        entry.style.paddingBottom = '3px';
        entry.style.marginBottom = '3px';
        
        content.appendChild(entry);
        content.scrollTop = content.scrollHeight;
      }
    }
  },
  
  // Toggle debug console visibility
  toggleDebugConsole: (): void => {
    if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
      const debugElement = document.getElementById('solana-token-debug');
      
      if (debugElement) {
        debugElement.style.display = debugElement.style.display === 'none' ? 'block' : 'none';
      } else {
        debugUtils.createDebugElement();
      }
    }
  },
  
  // Add keyboard shortcut for debug console
  setupDebugShortcut: (): void => {
    if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
      document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+D to toggle debug console
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          debugUtils.toggleDebugConsole();
        }
      });
    }
  }
};

// Initialize debug utilities
export const initDebugTools = (): void => {
  if (process.env.NODE_ENV === 'development') {
    debugUtils.log('Debug tools initialized');
    debugUtils.setupDebugShortcut();
    
    // Add global access for console debugging
    if (typeof window !== 'undefined') {
      (window as any).solanaTokenDebug = debugUtils;
    }
  }
};
