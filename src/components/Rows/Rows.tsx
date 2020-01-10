import React from 'react';
import { RowGetter, RowProps, GetRowKey } from '../../types';
import { Props as ColumnProps } from '../Column';

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
              {columns.map((column, columnIndex) => (
                <div key={columnIndex} style={{ width: column.width }}>
                  {column.cellRenderer ? (
                    column.cellRenderer({
                      columnIndex,
                      rowIndex,
                      cellData: row[column.dataKey],
                      columnData: column.columnData,
                      dataKey: column.dataKey,
                      rowData: row,
                    })
                  ) : (
                    <div>{row[column.dataKey]}</div>
                  )}
                </div>
              ))}
            </RowRenderer>
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(Rows);
