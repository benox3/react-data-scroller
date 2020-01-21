import React from 'react';
import { RowChildrenProps } from '../../types';

const RowChildren = (props: RowChildrenProps) => {
  return (
    <>
      {props.columns.map((column, columnIndex) => {
        const CellRenderer = column.cellRenderer;
        const adjustedColumnIndex = props.columnIndexOffset
          ? props.columnIndexOffset + columnIndex
          : columnIndex;

        return (
          <div key={columnIndex} style={{ width: column.width }}>
            {CellRenderer ? (
              <CellRenderer
                columnIndex={adjustedColumnIndex}
                rowIndex={props.rowIndex}
                cellData={props.rowData[column.dataKey]}
                columnData={column.columnData}
                dataKey={column.dataKey}
                rowData={props.rowData}
              />
            ) : (
              <div>{props.rowData[column.dataKey]}</div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default React.memo(RowChildren);
