import React from 'react';

export type OnTableRowsRenderedArg = {
  startIndex: number;
  stopIndex: number;
};

export type Props<Node> = {
  nodes: Node[];
  rowCount: number;
  fetchMore: ({ offset }: { offset: number }) => void;
  children: (arg: {
    onTableRowsRendered: (arg: OnTableRowsRenderedArg) => void;
  }) => React.ReactElement;
  onTableRowsRendered: (arg: OnTableRowsRenderedArg) => void;
  isNodeNotAvailable: (node: Node) => boolean;
};

function defaultIsNodeNotAvailable<Node>(product: Node) {
  return !Boolean(product);
}

function InfiniteLoader<Node>(props: Props<Node>) {
  const onTableRowsRendered = ({
    startIndex,
    stopIndex,
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    props.onTableRowsRendered({ startIndex, stopIndex });

    let shouldFetch = false;
    let offset = startIndex;

    for (let i = startIndex; i < stopIndex && i < props.rowCount - 1; i += 1) {
      if (props.isNodeNotAvailable(props.nodes[i])) {
        shouldFetch = true;
        offset = i;
        break;
      }
    }

    if (shouldFetch) {
      props.fetchMore({ offset });
    }
  };

  return props.children({
    onTableRowsRendered,
  });
}

const noop = () => {};

InfiniteLoader.defaultProps = {
  isNodeNotAvailable: defaultIsNodeNotAvailable,
  onTableRowsRendered: noop,
  fetchMore: noop,
};

export default InfiniteLoader;
