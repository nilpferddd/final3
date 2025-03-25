// Testskript für die Token-Verwaltungsfunktionalität
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { TokenManager } from '../src/tokenManager';

async function testTokenManagementFunctions() {
  try {
    console.log('Starte Test der Token-Verwaltungsfunktionalität...');
    
    // Simuliere eine Verbindung zum Solana-Devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Simuliere ein Keypair (in einer echten Anwendung würde dies aus der Wallet kommen)
    const payer = Keypair.generate();
    
    // Erstelle eine Instanz des TokenManager
    const tokenManager = new TokenManager(connection, payer);
    
    // Teste das Abrufen von Benutzer-Tokens
    console.log('Teste Abrufen von Benutzer-Tokens...');
    const userTokens = await tokenManager.getUserTokens();
    console.log(`${userTokens.length} Tokens gefunden`);
    
    // Teste das Abrufen von Token-Informationen
    console.log('Teste Abrufen von Token-Informationen...');
    const tokenMint = 'token_mint_address';
    const tokenInfo = await tokenManager.getTokenInfo(tokenMint);
    console.log(`Token-Informationen abgerufen für ${tokenMint}`);
    
    // Teste das Widerrufen der Token-Autorität
    console.log('Teste Widerrufen der Token-Autorität...');
    const revokeResult = await tokenManager.revokeTokenAuthority(tokenMint);
    console.log(`Autorität für Token ${tokenMint} widerrufen: ${revokeResult}`);
    
    // Teste das Aktualisieren von Token-Metadaten
    console.log('Teste Aktualisieren von Token-Metadaten...');
    const updateResult = await tokenManager.updateTokenMetadata(tokenMint, {
      name: 'Updated Token Name',
      description: 'Updated token description',
      website: 'https://updated-example.com'
    });
    console.log(`Metadaten für Token ${tokenMint} aktualisiert: ${updateResult}`);
    
    console.log('Token-Verwaltungsfunktionalität erfolgreich getestet!');
    return true;
  } catch (error) {
    console.error('Fehler beim Testen der Token-Verwaltungsfunktionalität:', error);
    return false;
  }
}

// Exportiere die Testfunktion
export { testTokenManagementFunctions };
