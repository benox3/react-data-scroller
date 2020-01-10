import * as faker from 'faker';
import React, { useState, useEffect } from 'react';
import { Column, ColumnProps } from '../src/';
import Group from '../src/components/Group';
import Row from '../src/components/Row';
import { RowProps, GetRowKey } from '../src/types';

import { storiesOf } from '@storybook/react';
import DataScroller, {
  CellRendererArgs,
  HeaderRendererArgs,
  RowGetterArgs,
} from '../src';

const cellRenderer = function CellRenderer({ rowData }: CellRendererArgs) {
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
};

const initialColumns = [
  {
    cellRenderer,
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
  return arr.map((_, index) => {
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

let columns: ColumnProps[] = [];
for (let counter = 0; counter < 10; counter += 1) {
  columns = [...initialColumns, ...(columns || [])];
}

columns = columns.map((column, index) => ({
  ...column,
  columnData: { ...(column.columnData || {}), columnIndex: index },
}));

let frozenColumns: ColumnProps[] = [];
for (let counter = 0; counter < 2; counter += 1) {
  frozenColumns = [...initialColumns, ...(frozenColumns || [])];
}

frozenColumns = frozenColumns.map((column, index) => ({
  ...column,
  columnData: { ...(column.columnData || {}), columnIndex: index },
}));

const GroupHeaderA = (props: { width: number }) => {
  return (
    <div style={{ backgroundColor: 'blue', width: props.width }}>
      First Group
    </div>
  );
};

const GroupHeaderB = (props: { width: number }) => {
  return (
    <div style={{ backgroundColor: 'red', width: props.width }}>
      Second Group
    </div>
  );
};

storiesOf('react-data-scroller', module).add('default', () => (
  <DataScroller
    rowCount={rowCount}
    rowGetter={rowGetter}
    rowHeight={50}
    height={500}
    headerHeight={100}
    width={500}
    initialTopRowIndex={50}
    groupHeaderHeight={30}
    columns={[
      <Group key="groupa" headerRenderer={GroupHeaderA}>
        {columns.map((column, index) => (
          <Column key={index} {...column} />
        ))}
      </Group>,
      <Group key="groupb" headerRenderer={GroupHeaderB}>
        {columns.map((column, index) => (
          <Column key={index} {...column} />
        ))}
      </Group>,
    ]}
    frozenColumns={frozenColumns.map((column, index) => (
      <Column key={index} {...column} />
    ))}
  />
));

const customGetRowKey: GetRowKey = ({ renderIndex }) => renderIndex;

storiesOf('react-data-scroller', module).add('custom row key', () => (
  <DataScroller
    rowCount={rowCount}
    rowGetter={rowGetter}
    rowHeight={50}
    height={500}
    headerHeight={100}
    width={500}
    initialTopRowIndex={50}
    groupHeaderHeight={30}
    columns={[
      <Group key="groupa" headerRenderer={GroupHeaderA}>
        {columns.map((column, index) => (
          <Column key={index} {...column} />
        ))}
      </Group>,
      <Group key="groupb" headerRenderer={GroupHeaderB}>
        {columns.map((column, index) => (
          <Column key={index} {...column} />
        ))}
      </Group>,
    ]}
    frozenColumns={frozenColumns.map((column, index) => (
      <Column key={index} {...column} />
    ))}
    getRowKey={customGetRowKey}
  />
));

const ScrollToIndexDataScroller = (props: {
  children: (arg: {
    scrollToIndex: number;
    handleScrollToIndex: () => void;
  }) => JSX.Element;
}) => {
  const [scrollToIndex, setScrollToIndex] = useState();
  useEffect(() => {
    setScrollToIndex(null);
  }, [scrollToIndex]);

  const handleScrollToIndex = () => {
    setScrollToIndex(20);
  };

  return props.children({ scrollToIndex, handleScrollToIndex });
};

storiesOf('react-data-scroller', module).add('scroll to index', () => (
  <ScrollToIndexDataScroller>
    {({
      scrollToIndex,
      handleScrollToIndex,
    }: {
      scrollToIndex: number;
      handleScrollToIndex: () => void;
    }) => (
      <div>
        <button onClick={handleScrollToIndex}>Scroll to 20</button>
        <DataScroller
          rowCount={rowCount}
          rowGetter={rowGetter}
          rowHeight={50}
          height={500}
          headerHeight={100}
          width={500}
          initialTopRowIndex={50}
          groupHeaderHeight={30}
          scrollToIndex={scrollToIndex}
          columns={[
            <Group key="groupa" headerRenderer={GroupHeaderA}>
              {columns.map((column, index) => (
                <Column key={index} {...column} />
              ))}
            </Group>,
            <Group key="groupb" headerRenderer={GroupHeaderB}>
              {columns.map((column, index) => (
                <Column key={index} {...column} />
              ))}
            </Group>,
          ]}
          frozenColumns={frozenColumns.map((column, index) => (
            <Column key={index} {...column} />
          ))}
        />
      </div>
    )}
  </ScrollToIndexDataScroller>
));

storiesOf('react-data-scroller', module).add('custom rowRenderer', () => {
  const rowRenderer = ({ rowIndex, children }: RowProps) => {
    // Render AMOUNT_OF_PADDING_ROWS empty rows
    if (rowIndex === 0) {
      return <div style={{ display: 'flex' }}>My Custom Row!</div>;
    }

    return <Row rowIndex={rowIndex} children={children} />;
  };

  return (
    <DataScroller
      rowCount={rowCount}
      rowGetter={rowGetter}
      rowHeight={50}
      height={500}
      headerHeight={100}
      width={500}
      initialTopRowIndex={0}
      groupHeaderHeight={30}
      rowRenderer={rowRenderer}
      columns={[
        <Group key="groupa" headerRenderer={GroupHeaderA}>
          {columns.map((column, index) => (
            <Column key={index} {...column} />
          ))}
        </Group>,
        <Group key="groupb" headerRenderer={GroupHeaderB}>
          {columns.map((column, index) => (
            <Column key={index} {...column} />
          ))}
        </Group>,
      ]}
      frozenColumns={frozenColumns.map((column, index) => (
        <Column key={index} {...column} />
      ))}
    />
  );
});
