import React from 'react';

export type CellRendererArgs<ColumnData = {}> = {
  cellData: any;
  columnData: ColumnData;
  columnIndex: number;
  dataKey: string;
  // @deprecated: Prefer getRowData with DataScrollerContext
  rowData?: any;
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
  rowRenderer: React.FC<RowProps>;
  scrollToIndex: number | null;
  width: number;
  getRowKey: GetRowKey;
};

export type GetRowKey = (args: {
  renderIndex: number;
  topRowIndex: number;
}) => number;

export type DataTableState = {
  tableScrollHeight: number;
  tableScrollWidth: number;
  topRowIndex: number;
  leftColumnIndex: number;
  totalVisibleRows: number;
  frozenColumnsWidth: number;
};

export type RowProps = {
  rowIndex: number;
  children: React.ReactNode;
};

export type RowChildrenProps = {
  rowIndex: number;
  rowData: any;
  columns: ColumnProps[];
  columnIndexOffset?: number;
};

export type CellRenderer<ColumnData = any> =
  | React.FC<CellRendererArgs<ColumnData>>
  | undefined;

export type ColumnProps<ColumnData = any> = {
  cellRenderer?: CellRenderer<ColumnData>;
  headerRenderer?: (arg: HeaderRendererArgs) => React.ReactNode;
  width: number;
  columnData?: any;
  dataKey: string;
  label: any;
};
