'use client';

import React from 'react';
import BaseBox, { BaseBoxProps } from './BaseBox';
import { DollarSign } from 'lucide-react';

export interface IncomeBoxProps extends Omit<BaseBoxProps, 'label' | 'color' | 'icon' | 'value'> {
  amount: string;
}

const IncomeBox: React.FC<IncomeBoxProps> = ({ amount, ...props }) => {
  const formattedValue = isNaN(parseFloat(amount)) ? '$0.00' : `$${parseFloat(amount).toFixed(2)}`;
  
  return (
    <BaseBox
      {...props}
      label="Income"
      color="#10B981"
      icon={<DollarSign className="w-3.5 h-3.5" />}
      value={amount}
    />
  );
};

export default IncomeBox; 