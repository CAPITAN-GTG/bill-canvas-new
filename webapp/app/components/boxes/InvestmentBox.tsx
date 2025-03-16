'use client';

import React from 'react';
import BaseBox, { BaseBoxProps } from './BaseBox';
import { TrendingUp } from 'lucide-react';

export interface InvestmentBoxProps extends Omit<BaseBoxProps, 'label' | 'color' | 'icon' | 'value'> {
  amount: string;
  investmentReturn: string;
}

const InvestmentBox: React.FC<InvestmentBoxProps> = ({ amount, investmentReturn, ...props }) => {
  const formattedAmount = isNaN(parseFloat(amount)) ? '$0.00' : `$${parseFloat(amount).toFixed(2)}`;
  const formattedReturn = isNaN(parseFloat(investmentReturn)) ? '0.0' : parseFloat(investmentReturn).toFixed(1);
  
  return (
    <BaseBox
      {...props}
      label="Investment"
      color="#8B5CF6"
      icon={<TrendingUp className="w-3.5 h-3.5" />}
      value={amount}
    />
  );
};

export default InvestmentBox; 