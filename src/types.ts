import React, { ReactNode } from 'react';

export type CellRendererArgs = {
  cellData: any;
  columnData?: any;
  columnIndex: number;
  dataKey: string;
  rowData: any;
  rowIndex: number;
};
export type HeaderRendererArgs = {
  columnData?: any;
  dataKey: string;
  label: any;
};

export type OnRowsRenderedArgs = {
  startIndex: number;
  overscanStartIndex: number;
  overscanStopIndex: number;
  stopIndex: number;
};

export type RowGetterArgs = {
  index: number;
};
export type RowGetter = (arg: RowGetterArgs) => any;

export type ColumnAndGroup = React.ReactFragment | React.ReactNode;

export type DataTableProps = {
  columns: React.ReactNode;
  frozenColumns: React.ReactNode;
  groupHeaderHeight: number;
  headerHeight: number;
  height: number;
  initialTopRowIndex: number;
  onRowsRendered: (arg: OnRowsRenderedArgs) => void;
  rowCount: number;
  rowGetter: RowGetter;
  rowHeight: number;
  rowRenderer: React.FC<Row>;
  scrollToIndex: number | null;
  width: number;
};

export type DataTableState = {
  tableScrollHeight: number;
  tableScrollWidth: number;
  topRowIndex: number;
  leftColumnIndex: number;
  totalVisibleRows: number;
  frozenColumnsWidth: number;
};

export type Row = {
  rowHeight: number;
  children: ReactNode;
};
