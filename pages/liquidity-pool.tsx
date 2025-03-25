import LiquidityPoolForm from '../components/LiquidityPoolForm';

export default function LiquidityPool({ walletConnected }) {
  return (
    <div>
      {!walletConnected ? (
        <div className="max-w-4xl mx-auto p-6 text-center">
          <div className="card p-12">
            <h1 className="text-3xl font-bold text-solana-green mb-6">Wallet verbinden</h1>
            <p className="text-xl text-gray-300 mb-8">
              Bitte verbinde deine Solana-Wallet, um einen Liquidity Pool zu erstellen.
            </p>
            <button className="btn-primary py-3 px-8 text-lg">Wallet verbinden</button>
          </div>
        </div>
      ) : (
        <LiquidityPoolForm />
      )}
    </div>
  );
}
