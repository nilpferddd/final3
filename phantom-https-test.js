// Simple test script to verify Phantom wallet works with HTTPS
// Save this file as phantom-https-test.js

const https = require('https');
const fs = require('fs');
const path = require('path');

// Create HTTPS server options
const options = {
  key: fs.readFileSync(path.join(__dirname, './certs/localhost+2-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './certs/localhost+2.pem'))
};

// Create a simple HTML page with Phantom wallet test
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phantom Wallet HTTPS Test</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #1a1a2e;
      color: white;
    }
    .container {
      background-color: #16213e;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    h1 {
      color: #7b68ee;
    }
    button {
      background-color: #7b68ee;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 10px;
    }
    button:hover {
      background-color: #6a5acd;
    }
    .status {
      margin-top: 20px;
      padding: 15px;
      border-radius: 4px;
    }
    .success {
      background-color: rgba(0, 128, 0, 0.2);
      border: 1px solid green;
    }
    .error {
      background-color: rgba(255, 0, 0, 0.2);
      border: 1px solid red;
    }
    .logs {
      background-color: #0f3460;
      border-radius: 4px;
      padding: 15px;
      margin-top: 20px;
      height: 200px;
      overflow-y: auto;
      font-family: monospace;
    }
    .log-entry {
      margin-bottom: 5px;
      border-bottom: 1px solid #2a2a4a;
      padding-bottom: 5px;
    }
  </style>
</head>
<body>
  <h1>Phantom Wallet HTTPS Test</h1>
  
  <div class="container">
    <h2>Wallet Status</h2>
    <div id="wallet-status">Checking Phantom installation...</div>
    
    <div id="connect-container" style="display: none;">
      <button id="connect-button">Connect Wallet</button>
    </div>
    
    <div id="connected-container" style="display: none;">
      <p>Connected Address: <span id="wallet-address"></span></p>
      <button id="disconnect-button">Disconnect</button>
    </div>
  </div>
  
  <div class="container">
    <h2>Test Results</h2>
    <div id="test-results">No tests run yet</div>
  </div>
  
  <div class="container">
    <h2>Logs</h2>
    <div id="logs" class="logs"></div>
  </div>

  <script>
    // Add log function
    function addLog(message) {
      const logs = document.getElementById('logs');
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
      logs.appendChild(logEntry);
      logs.scrollTop = logs.scrollHeight;
    }
    
    // Check if Phantom is installed
    function checkPhantomInstallation() {
      const walletStatus = document.getElementById('wallet-status');
      
      if (window.phantom?.solana?.isPhantom) {
        walletStatus.textContent = 'Phantom wallet is installed ✓';
        walletStatus.className = 'status success';
        document.getElementById('connect-container').style.display = 'block';
        addLog('Phantom wallet detected');
        return true;
      } else {
        walletStatus.textContent = 'Phantom wallet is not installed ✗';
        walletStatus.className = 'status error';
        addLog('Phantom wallet not detected');
        
        // Add install button
        const connectContainer = document.getElementById('connect-container');
        connectContainer.style.display = 'block';
        connectContainer.innerHTML = '<button onclick="window.open(\\'https://phantom.app/\\', \\'_blank\\')">Install Phantom</button>';
        return false;
      }
    }
    
    // Connect to Phantom wallet
    async function connectWallet() {
      try {
        addLog('Attempting to connect to Phantom wallet...');
        const provider = window.phantom?.solana;
        
        if (!provider) {
          throw new Error('Phantom provider not found');
        }
        
        const response = await provider.connect();
        const publicKey = response.publicKey.toString();
        
        addLog(\`Connected to wallet: \${publicKey}\`);
        
        document.getElementById('wallet-address').textContent = publicKey;
        document.getElementById('connect-container').style.display = 'none';
        document.getElementById('connected-container').style.display = 'block';
        
        const testResults = document.getElementById('test-results');
        testResults.textContent = 'Connection test passed! Popup appeared and connection was successful.';
        testResults.className = 'status success';
        
        return publicKey;
      } catch (error) {
        addLog(\`Error connecting to wallet: \${error.message}\`);
        
        const testResults = document.getElementById('test-results');
        if (error.code === 4001) {
          testResults.textContent = 'Connection test partially passed. Popup appeared but user rejected the request.';
          testResults.className = 'status success';
        } else {
          testResults.textContent = \`Connection test failed: \${error.message}\`;
          testResults.className = 'status error';
        }
        
        throw error;
      }
    }
    
    // Disconnect from wallet
    async function disconnectWallet() {
      try {
        addLog('Disconnecting from wallet...');
        const provider = window.phantom?.solana;
        
        if (provider) {
          await provider.disconnect();
          addLog('Disconnected from wallet');
          
          document.getElementById('connect-container').style.display = 'block';
          document.getElementById('connected-container').style.display = 'none';
        }
      } catch (error) {
        addLog(\`Error disconnecting from wallet: \${error.message}\`);
      }
    }
    
    // Initialize
    window.addEventListener('DOMContentLoaded', () => {
      addLog('Page loaded via HTTPS');
      
      // Check if Phantom is installed
      const isInstalled = checkPhantomInstallation();
      
      if (isInstalled) {
        // Add event listeners
        document.getElementById('connect-button').addEventListener('click', connectWallet);
        document.getElementById('disconnect-button').addEventListener('click', disconnectWallet);
        
        // Check if already connected
        const provider = window.phantom?.solana;
        if (provider?.isConnected) {
          const publicKey = provider.publicKey.toString();
          addLog(\`Already connected to wallet: \${publicKey}\`);
          
          document.getElementById('wallet-address').textContent = publicKey;
          document.getElementById('connect-container').style.display = 'none';
          document.getElementById('connected-container').style.display = 'block';
        }
      }
    });
  </script>
</body>
</html>
`;

// Create HTTPS server
const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

// Start server
const PORT = 3443;
server.listen(PORT, () => {
  console.log(`HTTPS Test Server running at https://localhost:${PORT}`);
  console.log('Open this URL in your browser to test Phantom wallet with HTTPS');
});
