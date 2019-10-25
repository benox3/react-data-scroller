/* Dependencies */
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Props as ColumnProps } from './components/Column';
import { Props as GroupProps } from './components/Group';
import Headers from './components/Headers';
import defaultRowRenderer from './components/Row';
import Rows from './components/Rows';
import useTableScrollDimensions from './hooks/useTableScrollDimensions';
import useTotalVisibleRows from './hooks/useTotalVisibleRows';
import Stickyfill from 'stickyfilljs';

/* Types */
import { DataTableProps } from './types';

/* Styles */
import './styles.css';

const getColumns = (node: React.ReactNode) => {
  return React.Children.toArray(node).reduce(
    (acc: any[], column: React.ReactNode) => {
      if (!React.isValidElement<ColumnProps>(column)) {
        return acc;
      }

      if (
        column.props &&
        // @ts-ignore
        column.type.__Column__
      ) {
        return [...acc, column.props];
      }

      return acc;
    },
    [],
  );
};

type EnrichedChildren = {
  children?: React.ReactNode;
};

const getColumnsAndGroups = (
  nodes: React.ReactNode = [],
): {
  groups: GroupProps<any>[];
  columns: ColumnProps[];
} => {
  return React.Children.toArray(nodes).reduce(
    (acc: { columns: any[]; groups: any[] }, node) => {
      if (!React.isValidElement<EnrichedChildren>(node)) {
        return acc;
      }

      const elementChild: React.ReactElement<EnrichedChildren> = node;

      if (node.type === React.Fragment && node.props) {
        if (!('children' in node.props)) {
          throw new Error('Your fragment must include children');
        }

        return {
          ...acc,
          ...getColumnsAndGroups(node.props.children),
        };
      }

      if (
        // @ts-ignore
        elementChild.type.__Group__
      ) {
        return {
          ...acc,
          columns: [...acc.columns, ...getColumns(node.props.children)],
          groups: [...acc.groups, node.props],
        };
      }

      return {
        ...acc,
        columns: [...acc.columns, ...getColumns(node)],
      };
    },
    {
      columns: [],
      groups: [],
    },
  );
};

function getGroupHeaders(columnSchema: {
  groups: GroupProps<any>[];
  columns: {}[];
}) {
  return columnSchema.groups.map((group, index) => {
    const groupHeaderWidth = React.Children.toArray(group.children).reduce(
      (width: number, child: any) => width + child.props.width,
      0,
    );

    const groupProps = {
      columns: columnSchema.columns,
      groupData: group.groupData,
      width: groupHeaderWidth,
    };

    // temporary set this to any
    const GroupHeader: any = group.headerRenderer;

    return <GroupHeader key={index} {...groupProps} />;
  });
}

const DataScroller = (props: DataTableProps) => {
  const tableScrollerRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const [topRowIndex, setTopRowIndex] = useState(props.initialTopRowIndex);
  const totalVisibleRows = useTotalVisibleRows(props);
  const frozenGroupsAndColumns = useMemo(
    () => getColumnsAndGroups(props.frozenColumns),
    [props.frozenColumns],
  );
  const standardGroupsAndColumns = useMemo(
    () => getColumnsAndGroups(props.columns),
    [props.columns],
  );
  const {
    frozenColumnsScrollWidth,
    tableScrollHeight,
    tableScrollWidth,
  } = useTableScrollDimensions({
    ...props,
    columns: standardGroupsAndColumns.columns,
    frozenColumns: frozenGroupsAndColumns.columns,
  });

  // polyfill for sticky
  useEffect(() => {
    if (stickyContainerRef.current) {
      Stickyfill.add(stickyContainerRef.current);
    }
  }, []);

  useEffect(() => {
    props.onRowsRendered({
      overscanStartIndex: topRowIndex,
      overscanStopIndex: topRowIndex + totalVisibleRows,
      startIndex: topRowIndex,
      stopIndex: topRowIndex + totalVisibleRows,
    });
  }, [topRowIndex, totalVisibleRows]);

  useLayoutEffect(() => {
    if (tableScrollerRef && tableScrollerRef.current) {
      const newScrollTop = topRowIndex * props.rowHeight;
      tableScrollerRef.current.scrollTop = newScrollTop;
    }
  }, [props.rowCount]);

  useLayoutEffect(() => {
    if (
      props.scrollToIndex !== null &&
      tableScrollerRef &&
      tableScrollerRef.current
    ) {
      const newScrollTop = props.scrollToIndex * props.rowHeight;
      tableScrollerRef.current.scrollTop = newScrollTop;
      setTopRowIndex(props.scrollToIndex);
    }
  }, [props.scrollToIndex]);

  const handleScroll = () => {
    if (!tableScrollerRef.current) return;
    const scrollPosition = tableScrollerRef.current.scrollTop;
    const newTopRowIndex = Math.floor(scrollPosition / props.rowHeight);

    setTopRowIndex(newTopRowIndex);
  };

  const standardGroupHeaders = useMemo(
    () => getGroupHeaders(standardGroupsAndColumns),
    [props.frozenColumns],
  );
  const frozenGroupHeaders = useMemo(
    () => getGroupHeaders(frozenGroupsAndColumns),
    [props.frozenColumns],
  );

  const columns = standardGroupsAndColumns.columns;
  const frozenColumns = frozenGroupsAndColumns.columns;

  const regularColumnsWidth = tableScrollWidth;
  return (
    <div
      ref={tableScrollerRef}
      style={{ height: props.height, overflowY: 'auto' }}
      onScroll={handleScroll}
      data-testid="scroll-container"
      className="scroll"
    >
      <div style={{ height: tableScrollHeight, position: 'relative' }}>
        <div
          ref={stickyContainerRef}
          className="sticky"
          style={{
            display: 'flex',
            top: 0,
          }}
        >
          {/* Frozen */}
          <div
            style={{
              height: props.height,
              overflowX: 'scroll',
              overflowY: 'hidden',
              width: frozenColumnsScrollWidth,
            }}
          >
            <div style={{ width: frozenColumnsScrollWidth }}>
              <div style={{ display: 'flex', height: props.groupHeaderHeight }}>
                {frozenGroupHeaders}
              </div>
              <Headers
                columns={frozenColumns}
                headerHeight={props.headerHeight}
              />
              <Rows
                rowGetter={props.rowGetter}
                totalVisibleRows={totalVisibleRows}
                columns={frozenColumns}
                topRowIndex={topRowIndex}
                rowHeight={props.rowHeight}
                rowRenderer={props.rowRenderer}
                rowCount={props.rowCount}
              />
            </div>
          </div>

          {/*Standard */}
          <div
            style={{
              flex: 1,
              height: props.height,
              overflowX: 'auto',
              overflowY: 'hidden',
            }}
          >
            <div style={{ width: regularColumnsWidth }}>
              <div style={{ display: 'flex', height: props.groupHeaderHeight }}>
                {standardGroupHeaders}
              </div>
              <Headers columns={columns} headerHeight={props.headerHeight} />
              <Rows
                rowGetter={props.rowGetter}
                totalVisibleRows={totalVisibleRows}
                columns={columns}
                topRowIndex={topRowIndex}
                rowHeight={props.rowHeight}
                rowRenderer={props.rowRenderer}
                rowCount={props.rowCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DataScroller.defaultProps = {
  frozenColumns: [],
  groupHeaderHeight: 0,
  headeerHeight: 0,
  initialTopRowIndex: 0,
  onRowsRendered: ({}) => undefined,
  rowRenderer: defaultRowRenderer,
  scrollToIndex: null,
};

export default React.memo(DataScroller);
