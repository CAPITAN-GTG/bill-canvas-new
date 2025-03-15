'use client';

import React from 'react';
import BaseBox, { BaseBoxProps } from './BaseBox';
import { Wallet } from 'lucide-react';

export interface IncomeBoxProps extends Omit<BaseBoxProps, 'label' | 'color' | 'icon'> {
  amount: number;
}

const IncomeBox: React.FC<IncomeBoxProps> = (props) => {
  return (
    <BaseBox
      {...props}
      label="Income"
      color="#10B981"
      icon={<Wallet className="w-3.5 h-3.5" />}
    />
  );
};

export default IncomeBox; 