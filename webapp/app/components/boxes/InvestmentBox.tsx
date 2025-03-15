'use client';

import React from 'react';
import BaseBox, { BaseBoxProps } from './BaseBox';
import { TrendingUp } from 'lucide-react';

export interface InvestmentBoxProps extends Omit<BaseBoxProps, 'label' | 'color' | 'icon'> {
  amount: number;
  investmentReturn: number;
}

const InvestmentBox: React.FC<InvestmentBoxProps> = (props) => {
  return (
    <BaseBox
      {...props}
      label="Investment"
      color="#8B5CF6"
      icon={<TrendingUp className="w-3.5 h-3.5" />}
    />
  );
};

export default InvestmentBox; 