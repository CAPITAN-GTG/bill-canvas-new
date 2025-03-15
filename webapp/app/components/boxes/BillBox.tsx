'use client';

import React from 'react';
import BaseBox, { BaseBoxProps } from './BaseBox';
import { Receipt } from 'lucide-react';

export interface BillBoxProps extends Omit<BaseBoxProps, 'label' | 'color' | 'icon'> {
  amount: number;
}

const BillBox: React.FC<BillBoxProps> = (props) => {
  return (
    <BaseBox
      {...props}
      label="Bill"
      color="#EF4444"
      icon={<Receipt className="w-3.5 h-3.5" />}
    />
  );
};

export default BillBox; 