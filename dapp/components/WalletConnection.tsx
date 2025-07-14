'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { BrowserWallet } from '@meshsdk/core';


import { Wallet, ChevronDown, Copy, ExternalLink } from "lucide-react"; 


export const WalletConnection = () => {
  const [isConnected, setIsConnected] = useState(false); 
  const [selectedWalletIndex, setSelectedWalletIndex] = useState()
  const [walletAddress, setWalletAddress] = useState("");
  const [balance,setBalance] = useState({ ada: "", learn: " " });

  const handleConnect = async () => {
    // In real implementation, this would integrate with Cardano wallets  
    const wallets = await BrowserWallet.getInstalledWallets(); 
    //console.log(wallets);  
    if(wallets.length > 0) { 
    
     
      try{
    const wallet = await BrowserWallet.enable('lace')  

    const adaBalance = await wallet.getLovelace()
    const used =  await wallet.getChangeAddress();
  
  
    setWalletAddress(used)
    setBalance(prevBalance => ({
      ...prevBalance,
      ada: adaBalance,
    }));
    setIsConnected(true);
     console.log(adaBalance)
  }catch(err){
    console.log(err);
    alert("error pls install lace wallet")
  }
} 
else{ 
  alert('Please Install lace wallet')
}
    }
     
    
     
    
     
    
   

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} className="flex items-center gap-2 w-full">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="hidden md:inline">{walletAddress}</span>
          <span className="md:hidden">Wallet</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wallet Address</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">{walletAddress}</span>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="p-3 border-b">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ADA Balance</span>
              <span className="text-sm font-medium">{balance.ada} ADA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">LEARN Tokens</span>
              <span className="text-sm font-medium">{balance.learn} LEARN</span>
            </div>
          </div>
        </div>

        <DropdownMenuItem className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
          Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
