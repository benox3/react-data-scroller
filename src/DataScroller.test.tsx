import * as faker from 'faker';
import React from 'react';
import { act, fireEvent, render } from 'react-testing-library';
import DataScroller from './DataScroller';

import {
  CellRendererArgs,
  Column,
  HeaderRendererArgs,
  RowGetterArgs,
} from './types';

const initialColumns = [
  {
    cellRenderer: ({ rowData }: CellRendererArgs) => {
      return (
        <div
          className="hover"
          style={{
            boxShadow: '0 0 5px 2px black',
          }}
        >
          {rowData.index}
        </div>
      );
    },
    columnData: {},
    dataKey: 'lastName',
    headerRenderer: ({ columnData }: HeaderRendererArgs) => (
      <div style={{ background: 'white' }}>Header {columnData.columnIndex}</div>
    ),
    label: 'last name',
    width: 200,
  },
  {
    cellRenderer: ({ rowData }: CellRendererArgs) => {
      return <div>{rowData.firstName}</div>;
    },
    columnData: {},
    dataKey: 'firstName',
    headerRenderer: ({ columnData }: HeaderRendererArgs) => (
      <div>Header{columnData.columnIndex}</div>
    ),
    label: 'first name',
    width: 200,
  },
];

const generateRows = (n: number) => {
  const arr = Array.apply(null, Array(n));
  return arr.map((item: any, index: number) => {
    return {
      index,
      avatar: faker.image.imageUrl(100, 100, 'people'),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
  });
};
const rowCount = 5000;
const rows = generateRows(rowCount);

const rowGetter = ({ index }: RowGetterArgs) => rows[index];

let columns: Column[] = [];
for (let counter = 0; counter < 10; counter += 1) {
  columns = [...initialColumns, ...(columns || [])];
}

columns = columns.map((column, index) => ({
  ...column,
  columnData: { ...(column.columnData || {}), columnIndex: index },
}));

let frozenColumns: Column[] = [];
for (let counter = 0; counter < 2; counter += 1) {
  frozenColumns = [...initialColumns, ...(frozenColumns || [])];
}

frozenColumns = frozenColumns.map((column, index) => ({
  ...column,
  columnData: { ...(column.columnData || {}), columnIndex: index },
}));

describe('DataScroller', () => {
  it('renders only one row', () => {
    const { container } = render(
      <DataScroller
        rowCount={rowCount}
        rowGetter={rowGetter}
        rowHeight={100}
        height={100}
        headerHeight={0}
        width={500}
        columns={columns}
        frozenColumns={frozenColumns}
      />,
    );

    expect(container.textContent).toMatch(rows[0].firstName);
    expect(container.textContent).not.toMatch(rows[1].firstName);
  });

  it('loads one additional row when scrolling', () => {
    const { container, debug, getByTestId } = render(
      <DataScroller
        rowCount={rowCount}
        rowGetter={rowGetter}
        rowHeight={100}
        height={100}
        headerHeight={0}
        width={500}
        columns={columns}
        frozenColumns={frozenColumns}
      />,
    );

    const scrollContainer = getByTestId('scroll-container');

    act(() => {
      scrollContainer.scrollTop = 50;
      fireEvent.scroll(scrollContainer);
    });

    expect(scrollContainer.textContent).toMatch(rows[1].firstName);
    expect(scrollContainer.textContent).not.toMatch(rows[0].firstName);
    expect(scrollContainer.textContent).not.toMatch(rows[2].firstName);
  });
});
