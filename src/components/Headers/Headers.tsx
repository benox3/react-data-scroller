import React from 'react';
import { ColumnProps } from '../../types';

export type Props = {
  columns: ColumnProps[];
  headerHeight: number;
};

export default function Headers({ headerHeight, columns }: Props) {
  return (
    <div style={{ display: 'flex', height: headerHeight }}>
      {columns.map((column, index) => (
        <div key={index} style={{ width: column.width }}>
          {(column.headerRenderer && column.headerRenderer(column)) || <div />}
        </div>
      ))}
    </div>
  );
}
