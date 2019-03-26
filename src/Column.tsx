import React from "react";

export default ({
  columnWidth,
  children
}: {
  children: React.ReactNode;
  columnWidth: number;
}) => <div style={{ width: columnWidth }}>{children}</div>;
