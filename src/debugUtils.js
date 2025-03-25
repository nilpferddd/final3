/**
 * Debug utilities for Solana Token Creator application
 * Provides comprehensive debugging tools for the application
 */

// Global debug settings
let DEBUG_ENABLED = true;
let LOG_LEVEL = 'info'; // 'error', 'warn', 'info', 'debug', 'trace'

// Log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4
};

/**
 * Initialize debug tools
 * @param {Object} options - Debug options
 * @param {boolean} options.enabled - Whether debugging is enabled
 * @param {string} options.logLevel - Log level ('error', 'warn', 'info', 'debug', 'trace')
 */
export const initDebugTools = (options = {}) => {
  if (typeof options.enabled === 'boolean') {
    DEBUG_ENABLED = options.enabled;
  }
  
  if (options.logLevel && LOG_LEVELS[options.logLevel] !== undefined) {
    LOG_LEVEL = options.logLevel;
  }
  
  // Initialize keyboard shortcuts
  if (typeof window !== 'undefined') {
    // Ctrl+Shift+D to toggle debug console
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        toggleDebugConsole();
      }
    });
    
    // Ctrl+Shift+L to toggle debug logging
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        DEBUG_ENABLED = !DEBUG_ENABLED;
        log('info', `Debug logging ${DEBUG_ENABLED ? 'enabled' : 'disabled'}`);
      }
    });
  }
  
  log('info', 'Debug tools initialized', { enabled: DEBUG_ENABLED, logLevel: LOG_LEVEL });
};

/**
 * Log a message at the specified level
 * @param {string} level - Log level
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
export const log = (level, message, data = null) => {
  if (!DEBUG_ENABLED || LOG_LEVELS[level] > LOG_LEVELS[LOG_LEVEL]) {
    return;
  }
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (data) {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](`${prefix} ${message}`, data);
    addToDebugConsole(`${prefix} ${message}`, JSON.stringify(data, null, 2));
  } else {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](`${prefix} ${message}`);
    addToDebugConsole(`${prefix} ${message}`);
  }
};

/**
 * Log an error message
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
export const error = (message, data = null) => log('error', message, data);

/**
 * Log a warning message
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
export const warn = (message, data = null) => log('warn', message, data);

/**
 * Log an info message
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
export const info = (message, data = null) => log('info', message, data);

/**
 * Log a debug message
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
export const debug = (message, data = null) => log('debug', message, data);

/**
 * Log a trace message
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
export const trace = (message, data = null) => log('trace', message, data);

/**
 * Create and show the debug console
 */
export const showDebugConsole = () => {
  if (typeof window === 'undefined') return;
  
  if (!window.debugConsole) {
    // Create debug console element
    const consoleDiv = document.createElement('div');
    consoleDiv.id = 'debug-console';
    consoleDiv.style.position = 'fixed';
    consoleDiv.style.bottom = '0';
    consoleDiv.style.right = '0';
    consoleDiv.style.width = '80%';
    consoleDiv.style.maxWidth = '800px';
    consoleDiv.style.height = '300px';
    consoleDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    consoleDiv.style.color = '#00ff00';
    consoleDiv.style.padding = '10px';
    consoleDiv.style.fontFamily = 'monospace';
    consoleDiv.style.fontSize = '12px';
    consoleDiv.style.overflowY = 'auto';
    consoleDiv.style.zIndex = '9999';
    consoleDiv.style.border = '1px solid #333';
    consoleDiv.style.borderRadius = '5px 0 0 0';
    consoleDiv.style.display = 'flex';
    consoleDiv.style.flexDirection = 'column';
    
    // Add header
    const header = document.createElement('div');
    header.style.borderBottom = '1px solid #333';
    header.style.paddingBottom = '5px';
    header.style.marginBottom = '5px';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    
    const title = document.createElement('div');
    title.innerText = 'Debug Console (Ctrl+Shift+D to toggle)';
    title.style.fontWeight = 'bold';
    
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '5px';
    
    // Add clear button
    const clearButton = document.createElement('button');
    clearButton.innerText = 'Clear';
    clearButton.style.backgroundColor = '#333';
    clearButton.style.color = 'white';
    clearButton.style.border = 'none';
    clearButton.style.padding = '2px 5px';
    clearButton.style.cursor = 'pointer';
    clearButton.style.fontSize = '10px';
    clearButton.onclick = clearDebugConsole;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.style.backgroundColor = '#333';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '2px 5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '10px';
    closeButton.onclick = hideDebugConsole;
    
    controls.appendChild(clearButton);
    controls.appendChild(closeButton);
    
    header.appendChild(title);
    header.appendChild(controls);
    
    // Add content area
    const content = document.createElement('div');
    content.id = 'debug-console-content';
    content.style.flex = '1';
    content.style.overflowY = 'auto';
    
    // Add input area
    const inputArea = document.createElement('div');
    inputArea.style.marginTop = '5px';
    inputArea.style.paddingTop = '5px';
    inputArea.style.borderTop = '1px solid #333';
    inputArea.style.display = 'flex';
    
    const prompt = document.createElement('span');
    prompt.innerText = '> ';
    prompt.style.color = '#00ff00';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.style.flex = '1';
    input.style.backgroundColor = 'transparent';
    input.style.border = 'none';
    input.style.color = '#00ff00';
    input.style.fontFamily = 'monospace';
    input.style.fontSize = '12px';
    input.style.outline = 'none';
    input.placeholder = 'Type a command and press Enter';
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const command = input.value.trim();
        if (command) {
          executeDebugCommand(command);
          input.value = '';
        }
      }
    });
    
    inputArea.appendChild(prompt);
    inputArea.appendChild(input);
    
    consoleDiv.appendChild(header);
    consoleDiv.appendChild(content);
    consoleDiv.appendChild(inputArea);
    
    document.body.appendChild(consoleDiv);
    window.debugConsole = consoleDiv;
    
    // Focus input
    input.focus();
    
    // Add initial message
    addToDebugConsole('Debug console initialized. Type "help" for available commands.');
  } else {
    window.debugConsole.style.display = 'flex';
  }
};

/**
 * Hide the debug console
 */
export const hideDebugConsole = () => {
  if (typeof window !== 'undefined' && window.debugConsole) {
    window.debugConsole.style.display = 'none';
  }
};

/**
 * Toggle the debug console
 */
export const toggleDebugConsole = () => {
  if (typeof window !== 'undefined') {
    if (window.debugConsole && window.debugConsole.style.display !== 'none') {
      hideDebugConsole();
    } else {
      showDebugConsole();
    }
  }
};

/**
 * Clear the debug console
 */
export const clearDebugConsole = () => {
  if (typeof window !== 'undefined' && window.debugConsole) {
    const content = document.getElementById('debug-console-content');
    if (content) {
      content.innerHTML = '';
      addToDebugConsole('Console cleared.');
    }
  }
};

/**
 * Add a message to the debug console
 * @param {string} message - Message to add
 * @param {string} details - Optional details to add (pre-formatted)
 */
export const addToDebugConsole = (message, details = null) => {
  if (typeof window !== 'undefined' && window.debugConsole) {
    const content = document.getElementById('debug-console-content');
    if (content) {
      const entry = document.createElement('div');
      entry.style.marginBottom = '3px';
      entry.style.wordBreak = 'break-all';
      
      entry.innerText = message;
      
      if (details) {
        const detailsElem = document.createElement('pre');
        detailsElem.style.marginLeft = '10px';
        detailsElem.style.marginTop = '2px';
        detailsElem.style.padding = '5px';
        detailsElem.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        detailsElem.style.borderLeft = '2px solid #333';
        detailsElem.style.fontSize = '10px';
        detailsElem.style.maxHeight = '100px';
        detailsElem.style.overflowY = 'auto';
        detailsElem.innerText = details;
        
        entry.appendChild(detailsElem);
      }
      
      content.appendChild(entry);
      content.scrollTop = content.scrollHeight;
    }
  }
};

/**
 * Execute a debug command
 * @param {string} command - Command to execute
 */
export const executeDebugCommand = (command) => {
  addToDebugConsole(`> ${command}`);
  
  const parts = command.split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  switch (cmd) {
    case 'help':
      addToDebugConsole('Available commands:');
      addToDebugConsole('  help - Show this help message');
      addToDebugConsole('  clear - Clear the console');
      addToDebugConsole('  log <level> <message> - Log a message at the specified level');
      addToDebugConsole('  loglevel <level> - Set the log level');
      addToDebugConsole('  debug <on|off> - Enable or disable debugging');
      addToDebugConsole('  wallet - Show wallet information');
      addToDebugConsole('  state - Show application state');
      break;
      
    case 'clear':
      clearDebugConsole();
      break;
      
    case 'log':
      if (args.length >= 2) {
        const level = args[0].toLowerCase();
        const message = args.slice(1).join(' ');
        
        if (LOG_LEVELS[level] !== undefined) {
          log(level, message);
        } else {
          addToDebugConsole(`Invalid log level: ${level}`);
        }
      } else {
        addToDebugConsole('Usage: log <level> <message>');
      }
      break;
      
    case 'loglevel':
      if (args.length === 1) {
        const level = args[0].toLowerCase();
        
        if (LOG_LEVELS[level] !== undefined) {
          LOG_LEVEL = level;
          addToDebugConsole(`Log level set to: ${level}`);
        } else {
          addToDebugConsole(`Invalid log level: ${level}`);
        }
      } else {
        addToDebugConsole(`Current log level: ${LOG_LEVEL}`);
        addToDebugConsole('Usage: loglevel <level>');
      }
      break;
      
    case 'debug':
      if (args.length === 1) {
        const value = args[0].toLowerCase();
        
        if (value === 'on' || value === 'true') {
          DEBUG_ENABLED = true;
          addToDebugConsole('Debugging enabled');
        } else if (value === 'off' || value === 'false') {
          DEBUG_ENABLED = false;
          addToDebugConsole('Debugging disabled');
        } else {
          addToDebugConsole(`Invalid value: ${value}`);
        }
      } else {
        addToDebugConsole(`Debugging is currently ${DEBUG_ENABLED ? 'enabled' : 'disabled'}`);
        addToDebugConsole('Usage: debug <on|off>');
      }
      break;
      
    case 'wallet':
      if (typeof window !== 'undefined' && window.phantom?.solana) {
        const provider = window.phantom.solana;
        const connected = provider.isConnected;
        const publicKey = provider.publicKey?.toString() || 'Not connected';
        
        addToDebugConsole('Wallet information:');
        addToDebugConsole(`  Connected: ${connected}`);
        addToDebugConsole(`  Public Key: ${publicKey}`);
      } else {
        addToDebugConsole('Phantom wallet not available');
      }
      break;
      
    case 'state':
      if (typeof window !== 'undefined') {
        addToDebugConsole('Application state:');
        addToDebugConsole(`  Debug Enabled: ${DEBUG_ENABLED}`);
        addToDebugConsole(`  Log Level: ${LOG_LEVEL}`);
        
        // Try to access Redux store if available
        if (window.__REDUX_STORE__) {
          const state = window.__REDUX_STORE__.getState();
          addToDebugConsole('  Redux Store:', JSON.stringify(state, null, 2));
        }
      }
      break;
      
    default:
      addToDebugConsole(`Unknown command: ${cmd}`);
      addToDebugConsole('Type "help" for available commands');
  }
};

// Initialize debug tools on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initDebugTools();
  });
}

// Export a default object with all functions
export default {
  initDebugTools,
  log,
  error,
  warn,
  info,
  debug,
  trace,
  showDebugConsole,
  hideDebugConsole,
  toggleDebugConsole,
  clearDebugConsole,
  addToDebugConsole,
  executeDebugCommand
};
