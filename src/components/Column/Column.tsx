import { ColumnProps } from '../../types';

// @ts-ignore
function Column(props: ColumnProps) {
  return null;
}

// Used for identifying the component type when iterating through children
Column.__Column__ = true;

export default Column;
