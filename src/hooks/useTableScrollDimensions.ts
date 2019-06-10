import { useMemo } from 'react';
import { Props as ColumnProps } from '../components/Column';
import { DataTableProps } from '../types';

type Column = Pick<ColumnProps, 'width'>;

type Props = Pick<
  DataTableProps,
  'rowCount' | 'headerHeight' | 'rowHeight' | 'groupHeaderHeight'
> & {
  columns: Column[];
  frozenColumns: Column[];
};

function getTableScrollHeight(props: Props) {
  const newTableScrollHeight =
    (props.rowCount + 1) * props.rowHeight +
    props.headerHeight +
    props.groupHeaderHeight;

  return newTableScrollHeight;
}

function sumColumnWidths(width: number, column: Column) {
  return width + column.width;
}

function getTotalColumnsWidth(columns: Column[]) {
  const totalWidth = columns.reduce(sumColumnWidths, 0);
  return totalWidth;
}

export default function useTableScrollDimensions(props: Props) {
  const frozenColumnsScrollWidth = useMemo(
    () => getTotalColumnsWidth(props.frozenColumns),
    [props.frozenColumns],
  );

  const tableScrollHeight = useMemo(() => getTableScrollHeight(props), [
    props.rowCount,
    props.rowHeight,
  ]);

  const tableScrollWidth = useMemo(() => getTotalColumnsWidth(props.columns), [
    props.columns,
  ]);

  return {
    frozenColumnsScrollWidth,
    tableScrollHeight,
    tableScrollWidth,
  };
}
