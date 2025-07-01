"use client"
import { BrowserWallet } from '@meshsdk/core';

// ✅ Correct function to list available wallets
export function getWallets() {
  return BrowserWallet.getInstalledWallets();
}
