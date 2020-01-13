import React from 'react';
import { RowProps } from '../../types';

const RowRenderer = (props: RowProps) => {
  return <>{props.children}</>;
};

export default RowRenderer;
