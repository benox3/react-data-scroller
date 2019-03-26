import React from "react";
import { Column } from "../../types";

export type Props = {
  headerHeight: number;
  columns: Column[];
};

export default function({
  headerHeight,
  columns
}: Props) {
  return (
    <div style={{ display: "flex", height: headerHeight }}>
      {columns.map((column, index) => (
        <div key={index} style={{ width: column.width }}>
          {(column.headerRenderer && column.headerRenderer(column)) || <div />}
        </div>
      ))}
    </div>
  );
}
