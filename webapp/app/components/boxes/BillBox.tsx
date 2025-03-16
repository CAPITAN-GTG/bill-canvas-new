'use client';

import React from 'react';
import BaseBox, { BaseBoxProps } from './BaseBox';
import { Receipt } from 'lucide-react';

export interface BillBoxProps extends Omit<BaseBoxProps, 'label' | 'color' | 'icon' | 'value'> {
  amount: string;
}

const BillBox: React.FC<BillBoxProps> = ({ amount, ...props }) => {
  const formattedValue = isNaN(parseFloat(amount)) ? '$0.00' : `$${parseFloat(amount).toFixed(2)}`;
  
  return (
    <BaseBox
      {...props}
      label="Bill"
      color="#EF4444"
      icon={<Receipt className="w-3.5 h-3.5" />}
      value={amount}
    />
  );
};

export default BillBox; 