import React from 'react';

export type NodesMap<Node> = {
  [key: number]: Node;
};

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
  offset: number;
  onTableRowsRendered: (arg: OnTableRowsRenderedArg) => void;
  isNodeNotAvailable: (node: Node) => boolean;
};

function defaultIsNodeNotAvailable<Node>(product: Node) {
  return !Boolean(product);
}

export default function InfiniteLoader<Node>(props: Props<Node>) {
  const onTableRowsRendered = ({
    startIndex,
    stopIndex,
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    props.onTableRowsRendered({ startIndex, stopIndex });

    let shouldFetch = false;
    let offset = props.offset;

    for (let i = startIndex; i < stopIndex; i += 1) {
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

InfiniteLoader.defaultProps = {
  isNodeNotAvailable: defaultIsNodeNotAvailable,
};
