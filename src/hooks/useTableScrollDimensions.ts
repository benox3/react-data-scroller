import React, { useMemo } from 'react';
import { Props as ColumnProps } from '../components/Column';
import { DataTableProps } from '../types';

export default function useTableScrollDimensions({
  rowCount,
  headerHeight,
  rowHeight,
  groupHeaderHeight,
  columns,
  frozenColumns,
}: Pick<
  DataTableProps,
  'rowCount' | 'headerHeight' | 'rowHeight' | 'groupHeaderHeight'
> & { columns: ColumnProps[]; frozenColumns: ColumnProps[] }) {
  const tableScrollHeight = useMemo(() => {
    const newTableScrollHeight =
      (rowCount + 1) * rowHeight + headerHeight + groupHeaderHeight;
    return newTableScrollHeight;
  }, [rowHeight, rowCount]);

  const tableScrollWidth = useMemo(() => {
    const newTableScrollWidth = columns.reduce(
      (width, column) => width + column.width,
      0,
    );
    return newTableScrollWidth;
  }, [columns]);

  const frozenColumnsScrollWidth = useMemo(() => {
    const newFrozenColumnsScrollWidth = frozenColumns.reduce(
      (width, column) => width + column.width,
      0,
    );
    return newFrozenColumnsScrollWidth;
  }, [frozenColumns]);

  return {
    frozenColumnsScrollWidth,
    tableScrollHeight,
    tableScrollWidth,
  };
}
