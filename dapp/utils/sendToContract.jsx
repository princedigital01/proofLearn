'use client'

import {
  BrowserWallet,
  Transaction,
  resolvePlutusScriptAddress,
} from '@meshsdk/core';





// 🟦 Send ADA to a Plutus smart contract
async function sendToContract(walletName) {
  const res = await fetch('/pluto.json'); // public/pluto.json
const json = await res.json();

const compiledCode = json.validators[0].compiledCode;

  try {
    const wallet = await BrowserWallet.enable(walletName);

    const validatorScript = {
      type: 'PlutusV2',
      script: compiledCode, 
    };

    const contractAddress = resolvePlutusScriptAddress(validatorScript, 0); // 0 = preview/testnet

    const usedAddresses = await wallet.getUsedAddresses();
    const senderAddress = usedAddresses[0];

    const tx = new Transaction({ initiator: wallet });

    tx.sendLovelace(
      { address: contractAddress },
      { lovelace: '2000000' } // Send 2 ADA
    );

    tx.attachScript(validatorScript);
    tx.addPlutusData(Data.void());

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

    console.log('✅ TX sent to contract:', txHash);
    return txHash;
  } catch (err) {
    console.error('❌ sendToContract error:', err);
    throw err;
  }
}

export const GetWallet=BrowserWallet
export default sendToContract