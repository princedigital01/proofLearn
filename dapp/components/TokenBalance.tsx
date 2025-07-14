'use client';

import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp } from "lucide-react"; 
import { MintNativeToken } from "./MintNativeToken";

export const TokenBalance = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 rounded-lg">
        <Coins className="h-4 w-4 text-yellow-600" />
        <span className="font-semibold text-yellow-800">2,450 LEARN</span>
        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          +95
        </Badge> 
      </div> 
      <div><MintNativeToken/></div>
    </div>
  );
};
