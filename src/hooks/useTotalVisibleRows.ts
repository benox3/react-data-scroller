import { useMemo } from 'react';
import { DataTableProps } from '../types';

type Props = Pick<
  DataTableProps,
  'groupHeaderHeight' | 'headerHeight' | 'height' | 'rowHeight'
>;

function getTotalVisibleRows(props: Props) {
  const totalTableHeight =
    props.height - props.headerHeight - props.groupHeaderHeight;
  const totalRowsThatFit = totalTableHeight / props.rowHeight;

  return Math.max(0, Math.ceil(totalRowsThatFit));
}

export default function useTotalVisibleRows(props: Props) {
  const totalVisibleRows = useMemo(() => getTotalVisibleRows(props), [
    props.groupHeaderHeight,
    props.headerHeight,
    props.height,
    props.rowHeight,
  ]);

  return totalVisibleRows;
}
