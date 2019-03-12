import * as faker from 'faker';
import * as React from 'react';

import * as actions from '@storybook/addon-actions';
import * as links from '@storybook/addon-links';

import {storiesOf} from '@storybook/react';
import DataScroller, {
  CellRendererArgs,
  Column,
  HeaderRendererArgs,
  RowGetterArgs,
} from '../src';

const initialColumns = [
  {
    cellRenderer: ({rowData}: CellRendererArgs) => {
      return (
        <div
          className="hover"
          style={{
            boxShadow: '0 0 5px 2px black',
          }}>
          {rowData.index}
        </div>
      );
    },
    columnData: {},
    dataKey: 'lastName',
    headerRenderer: ({columnData}: HeaderRendererArgs) => (
      <div style={{background: 'white'}}>Header {columnData.columnIndex}</div>
    ),
    label: 'last name',
    width: 200,
      },
  {
    cellRenderer: ({rowData}: CellRendererArgs) => {
      return <div>{rowData.firstName}</div>;
    },
    columnData: {},
    dataKey: 'firstName',
    headerRenderer: ({columnData}: HeaderRendererArgs) => (
      <div>Header{columnData.columnIndex}</div>
    ),
    label: 'first name',
    width: 200,
  },
];

const generateRows = (n: number) => {
  const arr = Array.apply(null, Array(n));
  return arr.map((item, index) => {
    return {
      avatar: faker.image.imageUrl(100, 100, 'people'),
      firstName: faker.name.firstName(),
      index,
      lastName: faker.name.lastName(),
    };
  });
};
const rowCount = 5000;
const rows = generateRows(rowCount);

const rowGetter = ({index}: RowGetterArgs) => rows[index];

let columns: Column[] = [];
for (let counter = 0; counter < 10; counter++) {
  columns = [...initialColumns, ...(columns || [])];
}

columns = columns.map((column, index) => ({
  ...column,
  columnData: {...(column.columnData || {}), columnIndex: index},
}));

let frozenColumns: Column[] = [];
for (let counter = 0; counter < 2; counter++) {
  frozenColumns = [...initialColumns, ...(frozenColumns || [])];
}

frozenColumns = frozenColumns.map((column, index) => ({
  ...column,
  columnData: {...(column.columnData || {}), columnIndex: index},
}));

storiesOf('react-data-scroller', module).add('default', () => (
  <DataScroller
    rowCount={rowCount}
    rowGetter={rowGetter}
    rowHeight={50}
    height={500}
    headerHeight={100}
    width={500}
    columns={columns}
    frozenColumns={frozenColumns}
  />
));
