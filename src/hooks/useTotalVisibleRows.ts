import React, { useMemo } from 'react';
import { DataTableProps } from '../types';

export default function useTotalVisibleRows(props: DataTableProps) {
  const totalVisibleRows = useMemo(() => {
    const totalRowsThatFit =
      (props.height - props.headerHeight - props.groupHeaderHeight) /
      props.rowHeight;
    const isLastRowCutOff = totalRowsThatFit % 1 !== 0;
    const newTotalVisibleRows = isLastRowCutOff
      ? Math.floor(totalRowsThatFit) + 1
      : Math.floor(totalRowsThatFit);
    return newTotalVisibleRows;
  }, [
    props.height,
    props.headerHeight,
    props.groupHeaderHeight,
    props.rowHeight,
  ]);

  return totalVisibleRows;
}
