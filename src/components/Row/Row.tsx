import React from 'react';
import { RowProps } from '../../types';

const RowRenderer = ({ children }: RowProps) => {
  return <div style={{ display: 'flex' }}>{children}</div>;
};

export default RowRenderer;
