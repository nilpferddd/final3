# Technische Dokumentation - Solana Token Creator

## Übersicht

Die Solana Token Creator Anwendung ist eine vollständige Web-Anwendung, die es Benutzern ermöglicht, Solana-Tokens zu erstellen, Liquidity Pools hinzuzufügen und ihre Tokens zu verwalten. Die Anwendung wurde mit Next.js, React, TypeScript und Tailwind CSS entwickelt und nutzt die Solana Web3.js und SPL-Token Bibliotheken für die Interaktion mit der Solana-Blockchain.

## Architektur

Die Anwendung folgt einer modularen Architektur mit klarer Trennung zwischen Frontend und Backend-Logik:

### Backend-Services

1. **tokenService.ts**: Enthält Funktionen zur Erstellung und Verwaltung von Solana-Tokens.
2. **metadataService.ts**: Verwaltet Token-Metadaten, Bild-Uploads und Social-Media-Links.
3. **raydiumService.ts**: Bietet grundlegende Funktionen für die Interaktion mit dem Raydium-Protokoll.
4. **raydiumV3Integration.ts**: Implementiert die detaillierte Integration mit Raydium V3 CPMM.
5. **liquidityPoolManager.ts**: Verwaltet Liquidity Pools und bietet eine vereinfachte API.
6. **tokenManager.ts**: Verwaltet Token-Informationen und -Operationen.

### Frontend-Komponenten

1. **Navbar.tsx**: Navigationsleiste für die Anwendung.
2. **TokenCreationForm.tsx**: Formular zur Erstellung von Tokens.
3. **LiquidityPoolForm.tsx**: Formular zur Erstellung von Liquidity Pools.
4. **ManageLiquidityForm.tsx**: Formular zur Verwaltung von Liquidität.
5. **TokenManagementForm.tsx**: Formular zur Verwaltung von Tokens.

### Seiten

1. **index.tsx**: Startseite der Anwendung.
2. **create-token.tsx**: Seite zur Token-Erstellung.
3. **liquidity-pool.tsx**: Seite zur Liquidity Pool-Erstellung.
4. **manage-liquidity.tsx**: Seite zur Verwaltung von Liquidität.
5. **tokens.tsx**: Übersichtsseite für Tokens.
6. **test.tsx**: Testseite für die Anwendungsfunktionalität.

## Technologien

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain-Integration**: Solana Web3.js, SPL-Token, Raydium V3 CPMM
- **Entwicklungstools**: ESLint, TypeScript

## Installation und Setup

### Voraussetzungen

- Node.js (v14 oder höher)
- npm (v6 oder höher)
- Solana CLI (v1.17.0 oder höher)

### Installation

1. Repository klonen:
   ```
   git clone https://github.com/username/solana-token-creator.git
   cd solana-token-creator
   ```

2. Abhängigkeiten installieren:
   ```
   npm install
   ```

3. Entwicklungsserver starten:
   ```
   npm run dev
   ```

4. Anwendung im Browser öffnen:
   ```
   http://localhost:3000
   ```

## Entwicklung

### Projektstruktur

```
solana-token-creator/
├── components/         # React-Komponenten
├── pages/              # Next.js-Seiten
├── public/             # Statische Dateien
├── src/                # Backend-Services
├── styles/             # CSS-Dateien
├── tests/              # Testskripte
├── tokens/             # Token-Metadaten
├── package.json        # Projektabhängigkeiten
└── README.md           # Projektdokumentation
```

### Wichtige Skripte

- `npm run dev`: Startet den Entwicklungsserver
- `npm run build`: Erstellt eine Produktionsversion
- `npm start`: Startet die Produktionsversion
- `npm test`: Führt Tests aus

## API-Referenz

### Token-Erstellung

```typescript
createToken(
  connection: Connection,
  payer: Keypair,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null,
  decimals: number,
  tokenName: string,
  tokenSymbol: string,
  tokenSupply: number
): Promise<{ mint: string; tokenAccount: string; signature: string }>
```

### Liquidity Pool-Erstellung

```typescript
createLiquidityPool(
  baseTokenMint: string,
  quoteTokenMint: string,
  baseAmount: number,
  quoteAmount: number,
  startDate?: Date
): Promise<LiquidityPoolInfo>
```

### Token-Verwaltung

```typescript
revokeTokenAuthority(mint: string): Promise<boolean>
```

## Sicherheitshinweise

- Die Anwendung sollte mit einer sicheren Wallet-Verbindung verwendet werden.
- Benutzer sollten ihre privaten Schlüssel niemals teilen.
- Die Revoke-Funktionalität ist irreversibel und sollte mit Vorsicht verwendet werden.

## Bekannte Probleme und Einschränkungen

- Die Anwendung ist derzeit nur für das Solana-Devnet konfiguriert.
- Die Bild-Upload-Funktionalität ist simuliert und würde in einer Produktionsumgebung IPFS oder einen anderen Speicherdienst verwenden.
- Die Raydium V3 CPMM-Integration ist teilweise simuliert und würde in einer Produktionsumgebung vollständig implementiert werden.

## Zukünftige Erweiterungen

- Unterstützung für das Solana-Mainnet
- Integration mit IPFS für Bild-Uploads
- Vollständige Implementierung der Raydium V3 CPMM-Integration
- Unterstützung für Token-Governance
- Erweiterte Token-Statistiken und -Analysen
