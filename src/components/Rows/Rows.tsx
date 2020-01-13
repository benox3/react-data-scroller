import React from 'react';
import RowChildren from '../RowChildren';

import { RowGetter, RowProps, ColumnProps, GetRowKey } from '../../types';

export type Props = {
  columns: ColumnProps[];
  topRowIndex: number;
  rowHeight: number;
  rowRenderer: React.FC<RowProps>;
  totalVisibleRows: number;
  rowGetter: RowGetter;
  rowCount: number;
  getRowKey: GetRowKey;
};

function Rows({
  columns,
  topRowIndex,
  rowHeight,
  rowRenderer,
  totalVisibleRows,
  rowGetter,
  rowCount,
  getRowKey,
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
              />
            </RowRenderer>
          </div>
        );
      })}
    </div>
  );
}

export default Rows;
