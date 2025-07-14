import { Mint, AssetMetadata, BrowserWallet  } from "@meshsdk/core";  
import { Action, PlutusScript } from "@meshsdk/core";
import { Transaction, Asset, ForgeScript } from "@meshsdk/core"; 
import type { NextComponentType, NextPageContext } from "next"; 
import { resolveDataHash } from "@meshsdk/core"; 
import type { Data } from "@meshsdk/core";  
import { Wallet } from "lucide-react";
  
const datumConstructor : Data = {  
    alternative: 0, 
    fields:[]
}
 
const redeemerStructure : Data = {  
    alternative: 0,  
    fields:[]

} 
 
const redeemer: Partial<Action> = {  
    tag: 'MINT', 
    data: redeemerStructure

} 
 
const nativeToken : Mint = { 
    assetName : 'LEARN', 
    assetQuantity: '100',  
    recipient: '' , 
    metadata: '', 
    label: '20'

} 
 
interface Props {} 
  
 export const MintNativeToken: NextComponentType<NextPageContext, {}, Props> = ( 
    props: Props
 ) => {  
    const mintTx = async  () => {
    const wallet = await BrowserWallet.enable(''); 
    const usedAddr = await wallet.getChangeAddress();
    const utxos = await wallet.getUtxos();  
 
    if (wallet && usedAddr && utxos){  
        const forgingScript = ForgeScript.withOneSignature(usedAddr) 
         
        const tx = new Transaction({initiator:wallet}).sendLovelace(  
            { 
                address: usedAddr, 
                datum: { 
                    value: datumConstructor
                }
            }, 

            '50000000'
        ).mintAsset(forgingScript, nativeToken) 
         
        const unsignedTx = await tx.build(); 
        const signedTx = await wallet.signTx(unsignedTx);  
        const txHash = await wallet.submitTx(signedTx); 

        console.log(txHash)

    } 
    else{ 
        alert('Wrong wallet instance')
    }
     
} 
  return ( 
    <button className="text-2xl text-white bg-yellow-600 px-3 py-1 cursor-pointer"  onClick={mintTx}>Mint LEARN</button>
  )
 }
