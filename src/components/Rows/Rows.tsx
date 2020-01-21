import React from 'react';
import RowChildren from '../RowChildren';

import { RowGetter, RowProps, ColumnProps, GetRowKey } from '../../types';

export type Props = {
  // used to offset columnIndex when there are frozen colums
  columnIndexOffset?: number;
  columns: ColumnProps[];
  getRowKey: GetRowKey;
  rowCount: number;
  rowGetter: RowGetter;
  rowHeight: number;
  rowRenderer: React.FC<RowProps>;
  topRowIndex: number;
  totalVisibleRows: number;
};

function Rows({
  columnIndexOffset,
  columns,
  getRowKey,
  rowCount,
  rowGetter,
  rowHeight,
  rowRenderer,
  topRowIndex,
  totalVisibleRows,
}: Props) {
  const RowRenderer = rowRenderer;

  return (
    <div>
      {Array.apply(null, new Array(totalVisibleRows)).map((_, renderIndex) => {
        const rowIndex = topRowIndex + renderIndex;
        const row = rowGetter({ index: rowIndex });
        if (rowIndex > rowCount - 1) {
          return null;
        }

        return (
          <div
            style={{ height: rowHeight, display: 'flex' }}
            key={getRowKey({ renderIndex, topRowIndex })}
          >
            <RowRenderer rowIndex={rowIndex}>
              <RowChildren
                rowIndex={rowIndex}
                columns={columns}
                rowData={row}
                columnIndexOffset={columnIndexOffset}
              />
            </RowRenderer>
          </div>
        );
      })}
    </div>
  );
}

export default Rows;
