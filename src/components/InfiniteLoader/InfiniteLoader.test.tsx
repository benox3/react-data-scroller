import React from 'react';
import InfiniteLoader from './InfiniteLoader';
import { render } from 'react-testing-library';

describe('InfiniteLoader', () => {
  it('calls fetchMore when rowCount is larger than offset', () => {
    const props = {
      nodes: [],
      rowCount: 10,
      fetchMore: jest.fn(),
      children: ({ onTableRowsRendered }: any) => {
        onTableRowsRendered({ startIndex: 0, stopIndex: 20 });

        return <div />;
      },
    };
    render(<InfiniteLoader {...props} />);
    expect(props.fetchMore).toBeCalled();
  });

  it('does not call fetchMore when startIndex is out of range of the rowCount', () => {
    const props = {
      nodes: [],
      rowCount: 3,
      fetchMore: jest.fn(),
      children: ({ onTableRowsRendered }: any) => {
        onTableRowsRendered({ startIndex: 3, stopIndex: 20 });

        return <div />;
      },
    };
    render(<InfiniteLoader {...props} />);
    expect(props.fetchMore).not.toBeCalled();
  });
});
