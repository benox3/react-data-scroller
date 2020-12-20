import React from 'react';
import { ColumnProps } from '../../types';

export type Props = {
  columns: ColumnProps[];
  headerHeight: number;
};

export default function Headers({ headerHeight, columns }: Props) {
  return (
    <div style={{ display: 'flex', height: headerHeight }}>
      {columns.map(renderColumn)}
    </div>
  );
}

function renderColumn(column: ColumnProps, index: number) {
  const Header = column.headerRenderer || FallbackHeader;

  return (
    <div key={index} style={{ width: column.width }}>
      <Header {...column} />
    </div>
  );
}

function FallbackHeader() {
  return <div />;
}
