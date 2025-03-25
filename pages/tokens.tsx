import { useState, useEffect } from 'react';
import { TokenInfo } from '../src/tokenManager';

export default function TokenOverviewPage() {
  // State für Token-Liste
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simuliere das Laden von Token-Informationen
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setIsLoading(true);
        
        // In einer echten Anwendung würde hier die TokenManager.getUserTokens Methode aufgerufen werden
        // Simuliere eine API-Anfrage
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTokens: TokenInfo[] = [
          {
            mint: 'token1_mint_address',
            name: 'Awesome Token',
            symbol: 'AWSM',
            decimals: 9,
            supply: 1000000000,
            description: 'Ein fantastischer Token für die Solana-Blockchain',
            image: 'https://example.com/token1.png',
            website: 'https://token1.example.com',
            twitter: 'https://twitter.com/token1',
            telegram: 'https://t.me/token1',
            isAuthoritySelf: true,
            createdAt: new Date(Date.now() - 86400000), // 1 Tag alt
          },
          {
            mint: 'token2_mint_address',
            name: 'Super Coin',
            symbol: 'SUPR',
            decimals: 9,
            supply: 500000000,
            description: 'Der beste Coin im Solana-Ökosystem',
            image: 'https://example.com/token2.png',
            website: 'https://token2.example.com',
            twitter: 'https://twitter.com/token2',
            isAuthoritySelf: false,
            createdAt: new Date(Date.now() - 172800000), // 2 Tage alt
          },
          {
            mint: 'token3_mint_address',
            name: 'Mega Token',
            symbol: 'MEGA',
            decimals: 6,
            supply: 100000000,
            description: 'Ein Token mit enormem Potenzial',
            isAuthoritySelf: true,
            createdAt: new Date(Date.now() - 259200000), // 3 Tage alt
          }
        ];
        
        setTokens(mockTokens);
      } catch (err) {
        console.error('Fehler beim Laden der Tokens:', err);
        setError('Fehler beim Laden der Tokens. Bitte versuche es erneut.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokens();
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-solana-green">Deine Solana Tokens</h1>
      
      {error ? (
        <div className="bg-red-800 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      ) : null}
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-solana-purple">Token-Übersicht</h2>
        <button className="btn-primary">Neuen Token erstellen</button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-300">Tokens werden geladen...</p>
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-12 bg-dark-blue rounded-lg">
          <p className="text-gray-300 mb-4">Du hast noch keine Tokens erstellt.</p>
          <button className="btn-primary">Ersten Token erstellen</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <div key={token.mint} className="card hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="flex items-center mb-4">
                {token.image ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img src={token.image} alt={token.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-white">{token.symbol.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{token.name}</h3>
                  <p className="text-sm text-gray-400">{token.symbol}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Versorgung:</span>
                  <span className="text-white">{token.supply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dezimalstellen:</span>
                  <span className="text-white">{token.decimals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Erstellt am:</span>
                  <span className="text-white">{token.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Autorität:</span>
                  <span className={token.isAuthoritySelf ? "text-green-500" : "text-red-500"}>
                    {token.isAuthoritySelf ? "Aktiv" : "Widerrufen"}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm py-1 px-3 flex-1">Details</button>
                {token.isAuthoritySelf && (
                  <button className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded">
                    Widerrufen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
