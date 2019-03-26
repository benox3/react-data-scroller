import React from "react";
import { Row } from "../../types";

const RowRenderer = ({ rowHeight, children }: Row) => {
  return <div style={{ display: "flex", height: rowHeight }}>{children}</div>;
};

export default RowRenderer;
