"use client";

import { useState, useEffect } from "react";
import { BrowserWallet } from "@meshsdk/core";
import sendToContract from "@/utils/sendToContract";

type WalletMetadata = {
  id: string;
  name: string;
  icon: string;
};

export default function Page() {
  const [wallets, setWallets] = useState<WalletMetadata[]>([]);
  const [connectedWalletId, setConnectedWalletId] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🧠 Detect installed wallets
  const detectWallets = () => {
    const available = BrowserWallet.getInstalledWallets() as WalletMetadata[];
    setWallets(available);
  };

  useEffect(() => {
    detectWallets();
  }, []);

  // 🔌 Connect to selected wallet
  const connectWallet = async (walletId: string) => {
    try {
      const wallet = await BrowserWallet.enable(walletId);
      const used = await wallet.getUsedAddresses();
      if (used.length > 0) {
        setConnectedWalletId(walletId);
        setConnectedAddress(used[0]);
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Make sure your wallet is installed and unlocked.");
    }
  };

  // ❌ Disconnect
  const disconnectWallet = () => {
    setConnectedWalletId(null);
    setConnectedAddress(null);
  };

  // 🚀 Send ADA
  const handleSend = async () => {
    if (!connectedWalletId) return;
    try {
      setLoading(true);
      await sendToContract(connectedWalletId);
      alert("✅ Transaction sent!");
    } catch (err) {
      console.error("TX Error:", err);
      alert("❌ Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">🪙 Cardano DApp</h1>

      {/* 🔍 No Wallet Installed */}
      {wallets.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-sm text-gray-700">
          <p className="font-semibold text-yellow-800">⚠️ No Cardano Wallet Detected</p>
          <p className="mt-1">
            To use this app, please install a Cardano wallet extension:
            <br />
            <a href="https://namiwallet.io" target="_blank" className="text-blue-600 underline">Nami</a>,{" "}
            <a href="https://eternl.io" target="_blank" className="text-blue-600 underline">Eternl</a>, or{" "}
            <a href="https://www.lace.io/" target="_blank" className="text-blue-600 underline">Lace</a>.
          </p>
          <button
            onClick={detectWallets}
            className="mt-3 text-sm text-blue-600 underline"
          >
            🔄 Retry Detection
          </button>
        </div>
      ) : connectedWalletId ? (
        // ✅ Connected Wallet UI
        <div className="border p-4 rounded bg-green-50 space-y-2 text-sm">
          <p>🔗 Connected: <strong>{connectedWalletId}</strong></p>
          <p className="break-all text-gray-700">📍 {connectedAddress}</p>
          <button
            onClick={disconnectWallet}
            className="text-red-600 underline text-sm"
          >
            Disconnect
          </button>
        </div>
      ) : (
        // 🟢 Wallet Selection
        <>
          <p>Select a wallet to connect:</p>
          <div className="space-y-2">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => connectWallet(wallet.id)}
                className="flex items-center w-full px-4 py-2 border rounded hover:bg-gray-100"
              >
                <img src={wallet.icon} alt={wallet.name} className="w-5 h-5 mr-2" />
                {wallet.name}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 🚀 Send TX Button */}
      <button
        onClick={handleSend}
        disabled={!connectedWalletId || loading}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send 2 ADA to Contract"}
      </button>
    </div>
  );
}
