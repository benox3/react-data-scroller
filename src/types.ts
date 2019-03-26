import { ReactNode, UIEvent } from "react";

export type CellRendererArgs = {
  cellData: any;
  columnData: any;
  columnIndex: number;
  dataKey: string;
  rowData: any;
  rowIndex: number;
}
export type HeaderRendererArgs = {
  columnData: any;
  dataKey: string;
  label: any;
}

export type Column = {
  cellRenderer: (arg: CellRendererArgs) => ReactNode;
  headerRenderer: (arg: HeaderRendererArgs) => ReactNode;
  width: number;
  columnData: any;
  dataKey: string;
  label: any;
}

export type RowGetterArgs = {
  index: number;
}

export type OnRowsRenderedArgs = {
  startIndex: number;
  overscanStartIndex: number;
  overscanStopIndex: number;
  stopIndex: number;
}

export type DataTableProps = {
  columns: Column[];
  frozenColumns: Column[];
  rowGetter: (arg: RowGetterArgs) => any;
  rowCount: number;
  rowHeight: number;
  rowRenderer: React.FC<Row>;
  headerHeight: number;
  height: number;
  onRowsRendered: (arg: OnRowsRenderedArgs) => void;
  width: number;
}

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
