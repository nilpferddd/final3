#!/bin/bash

# HTTPS Server Setup Script for Solana Token Creator
# This script sets up a local HTTPS server for testing Phantom wallet integration

echo "=== HTTPS Server Setup for Phantom Wallet Integration ==="
echo "This script will set up a local HTTPS server for your application."
echo ""

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "Installing mkcert for creating local SSL certificates..."
    
    # Check the operating system
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update
        sudo apt-get install -y libnss3-tools
        
        # Download and install mkcert
        curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
        chmod +x mkcert-v*-linux-amd64
        sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install mkcert
        brew install nss # for Firefox
    else
        echo "Unsupported operating system. Please install mkcert manually: https://github.com/FiloSottile/mkcert"
        exit 1
    fi
    
    # Initialize mkcert
    mkcert -install
    echo "mkcert installed successfully!"
fi

# Create directory for certificates
mkdir -p ./certs
cd ./certs

# Generate certificates
echo "Generating SSL certificates for localhost..."
mkcert localhost 127.0.0.1 ::1
echo "Certificates generated successfully!"

cd ..

# Create HTTPS server configuration
echo "Creating HTTPS server configuration..."

# Create server.js file for HTTPS server
cat > server.js << 'EOL'
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, './certs/localhost+2-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './certs/localhost+2.pem'))
};

const PORT = 3443;

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${PORT}`);
    console.log('> You can now test Phantom wallet integration with HTTPS');
  });
});
EOL

# Update package.json to include HTTPS script
echo "Updating package.json with HTTPS script..."

# Create a backup of package.json
cp package.json package.json.bak

# Try to update package.json
if command -v jq &> /dev/null; then
    # Using jq if available
    jq '.scripts += {"dev:https": "node server.js"}' package.json > package.json.tmp && mv package.json.tmp package.json
else
    # Fallback to sed
    sed -i 's/"scripts": {/"scripts": {\n    "dev:https": "node server.js",/g' package.json
fi

# Install required dependencies
echo "Installing required dependencies..."
npm install --save https url

echo ""
echo "=== HTTPS Server Setup Complete! ==="
echo ""
echo "To start your application with HTTPS, run:"
echo "npm run dev:https"
echo ""
echo "Then open https://localhost:3443 in your browser."
echo "The Phantom wallet popup should now work correctly!"
echo ""
echo "Note: You may need to accept the self-signed certificate warning in your browser."
