import React from "react";
import { Column, Row } from "../../types";

export type Props = {
  rows: any[];
  columns: Column[];
  topRowIndex: number;
  rowHeight: number;
  rowRenderer: React.FC<Row>;
};

export default function({
  rows,
  columns,
  topRowIndex,
  rowHeight,
  rowRenderer
}: Props) {
  const RowRenderer = rowRenderer;
  return (
    <div>
      {rows.map((row = {}, rowIndex) => (
        <RowRenderer rowHeight={rowHeight} key={rowIndex}>
          {columns.map((column, index) => (
            <div key={index} style={{ width: column.width }}>
              {column.cellRenderer ? (
                column.cellRenderer({
                  cellData: row[column.dataKey],
                  columnData: column.columnData,
                  columnIndex: index,
                  dataKey: column.dataKey,
                  rowData: row,
                  rowIndex: rowIndex + topRowIndex
                })
              ) : (
                <div>{row[column.dataKey]}</div>
              )}
            </div>
          ))}
        </RowRenderer>
      ))}
    </div>
  );
}
