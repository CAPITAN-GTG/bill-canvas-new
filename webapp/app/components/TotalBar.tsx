'use client';

import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

interface TotalBarProps {
  total: number;
  totalInvestments: number;
  investmentReturns: number;
}

const TotalBar: React.FC<TotalBarProps> = ({ 
  total, 
  totalInvestments, 
  investmentReturns,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 min-w-[300px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-black">Total:</span>
          </div>
          <span className={`text-lg font-bold ${total >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${total.toFixed(2)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-black">Investments:</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-black">${totalInvestments.toFixed(2)}</div>
            <div className="text-xs text-green-500">+${investmentReturns.toFixed(2)} returns</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalBar; 