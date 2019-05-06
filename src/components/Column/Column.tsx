import React from 'react';
import { CellRendererArgs, HeaderRendererArgs } from '../../types';

export type Props = {
  cellRenderer: (arg: CellRendererArgs) => React.ReactNode;
  headerRenderer: (arg: HeaderRendererArgs) => React.ReactNode;
  width: number;
  columnData: any;
  dataKey: string;
  label: any;
};

export default function Column(props: Props) {
  return null;
}

// Used for identifying the component type when iterating through children
Column.__Column__ = true;
