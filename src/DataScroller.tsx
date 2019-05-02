/* Dependencies */
import React, {UIEvent, useEffect, useMemo, useRef, useState} from 'react';
import Group from './components/Group';
import Headers from './components/Headers';
import defaultRowRenderer from './components/Row';
import Rows from './components/Rows';

/* Types */
import {Column, DataTableProps} from './types';

/* Styles */
import './styles.css';

const getColumns = (nodes: React.ReactNode): Column[] => {
  return React.Children.toArray(nodes).reduce(
    (columns: Column[], node: any) => {
      if (
        node.type === React.Fragment ||
        node.type.displayName === 'Group' ||
        node.type === Group ||
        (typeof node.type === 'function' &&
          node.type.prototype instanceof Group)
      ) {
        return [...columns, ...getColumns(node.props.children)];
      }

      if (!node.props) {
        return [...columns];
      }
      return [...columns, node.props];
    },
    [],
  );
};

const getGroups = (nodes: React.ReactNode = []): any[] => {
  return React.Children.toArray(nodes).reduce((groups: any[], node: any) => {
    if (node.type === React.Fragment && node.props.children) {
      return [...groups, ...getGroups(node.props.children)];
    }
    if (
      node.type.displayName === 'Group' ||
      node.type === Group ||
      (typeof node.type === 'function' && node.type.prototype instanceof Group)
    ) {
      if (!node.props) {
        return [...groups];
      }
      return [...groups, node.props];
    }

    return groups;
  }, []);
};

const DataScroller = (props: DataTableProps) => {
  const tableScrollerRef = useRef<HTMLDivElement>(null);
  const [topRowIndex, setTopRowIndex] = useState(props.initialTopRowIndex);
  const totalVisibleRows = useTotalVisibleRows(props);
  const {
    frozenColumnsScrollWidth,
    tableScrollHeight,
    tableScrollWidth,
  } = useTableScrollDimensions(props);

  useEffect(() => {
    props.onRowsRendered({
      overscanStartIndex: topRowIndex,
      overscanStopIndex: topRowIndex + totalVisibleRows,
      startIndex: topRowIndex,
      stopIndex: topRowIndex + totalVisibleRows,
    });
  }, [topRowIndex, totalVisibleRows]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollPosition = tableScrollerRef.current
      ? tableScrollerRef.current.scrollTop
      : 0;
    const newTopRowIndex = Math.floor(scrollPosition / props.rowHeight);

    setTopRowIndex(newTopRowIndex);
  };

  const frozenGroupHeaders = useMemo(() =>
    getGroups(props.frozenColumns).map(group => {
      const groupHeaderWidth = group.children.reduce(
        (width: number, child: any) => width + child.props.width,
        0,
      );

      const groupProps = {
        columns: group.children.map((child: any) => child.props),
        groupData: group.groupData,
        width: groupHeaderWidth,
      };
      const GroupHeader = group.headerRenderer;

      return <GroupHeader {...groupProps} />;
    }),
    [props.frozenColumns]
  );

  const groupHeaders = useMemo(() =>
    getGroups(props.columns).map(group => {
      const groupHeaderWidth = group.children.reduce(
        (width: number, child: any) => width + child.props.width,
        0,
      );

      const groupProps = {
        columns: group.children.map((child: any) => child.props),
        groupData: group.groupData,
        width: groupHeaderWidth,
      };
      const GroupHeader = group.headerRenderer;

      return <GroupHeader {...groupProps} />;
    }),
    [props.columns]
  );
  const columns= useMemo(() => getColumns(props.columns), [props.columns])
  const frozenColumns= useMemo(() => getColumns(props.frozenColumns), [props.frozenColumns])

  const regularColumnsWidth = tableScrollWidth;
  return (
    <div
      ref={tableScrollerRef}
      style={{height: props.height, overflowY: 'auto'}}
      onScroll={handleScroll}
      data-testid="scroll-container"
      className="scroll">
      <div style={{height: tableScrollHeight, position: 'relative'}}>
        <div
          className="sticky"
          style={{
            display: 'flex',
            fontSize: '20px',
            top: 0,
          }}>
          {/* Frozen */}
          <div
            style={{
              height: props.height,
              overflowX: 'scroll',
              overflowY: 'hidden',
              width: frozenColumnsScrollWidth,
            }}>
            <div style={{width: frozenColumnsScrollWidth}}>
              <div style={{display: 'flex', height: props.groupHeaderHeight}}>
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
            }}>
            <div style={{width: regularColumnsWidth}}>
              <div style={{display: 'flex', height: props.groupHeaderHeight}}>
                {groupHeaders}
              </div>
              <Headers
                columns={columns}
                headerHeight={props.headerHeight}
              />
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

const useTableScrollDimensions = (props: DataTableProps) => {
  const tableScrollHeight = useMemo(() => {
    const newTableScrollHeight =
      (props.rowCount + 1) * props.rowHeight +
      props.headerHeight +
      props.groupHeaderHeight;
    return newTableScrollHeight;
  }, [props.rowHeight, props.rowCount]);

  const tableScrollWidth = useMemo(() => {
    const newTableScrollWidth = getColumns(props.columns).reduce(
      (width, column) => width + column.width,
      0,
    );
    return newTableScrollWidth;
  }, [props.columns]);

  const frozenColumnsScrollWidth = useMemo(() => {
    const newFrozenColumnsScrollWidth = getColumns(props.frozenColumns).reduce(
      (width, column) => width + column.width,
      0,
    );
    return newFrozenColumnsScrollWidth;
  }, [props.frozenColumns]);

  return {
    frozenColumnsScrollWidth,
    tableScrollHeight,
    tableScrollWidth,
  };
};

const useTotalVisibleRows = (props: DataTableProps) => {
  const totalVisibleRows = useMemo(() => {
    const totalRowsThatFit =
      (props.height - props.headerHeight - props.groupHeaderHeight) /
      props.rowHeight;
    const isLastRowCutOff = totalRowsThatFit % 1 !== 0;
    const newTotalVisibleRows = isLastRowCutOff
      ? Math.floor(totalRowsThatFit) + 1
      : Math.floor(totalRowsThatFit);
    return newTotalVisibleRows;
  }, [
    props.height,
    props.headerHeight,
    props.groupHeaderHeight,
    props.rowHeight,
  ]);

  return totalVisibleRows;
};

DataScroller.defaultProps = {
  frozenColumns: [],
  groupHeaderHeight: 0,
  headeerHeight: 0,
  initialTopRowIndex: 0,
  onRowsRendered: ({}) => undefined,
  rowRenderer: defaultRowRenderer,
};

export default React.memo(DataScroller);
