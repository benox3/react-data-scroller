import React from 'react';
import { Props as ColumnProps } from '../Column';

export type Props = {
  headerHeight: number;
  columns: ColumnProps[];
};

export default function({ headerHeight, columns }: Props) {
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
