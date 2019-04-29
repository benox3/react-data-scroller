/* Dependencies */
import React, {UIEvent, useEffect, useRef, useState} from 'react';
import Headers from './components/Headers';
import defaultRowRenderer from './components/Row';
import Rows from './components/Rows';

/* Types */
import {DataTableProps} from './types';

/* Styles */
import './styles.css';

const  DataScroller = (props: DataTableProps) => {
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
              <Headers
                columns={props.frozenColumns}
                headerHeight={props.headerHeight}
              />
              <Rows
                rowGetter={props.rowGetter}
                totalVisibleRows={totalVisibleRows}
                columns={props.frozenColumns}
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
              <Headers
                columns={props.columns}
                headerHeight={props.headerHeight}
              />
              <Rows
                rowGetter={props.rowGetter}
                totalVisibleRows={totalVisibleRows}
                columns={props.columns}
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
}

const useTableScrollDimensions = (props: DataTableProps) => {
  const [tableScrollHeight, setTableScrollHeight] = useState(0);
  const [tableScrollWidth, setTableScrollWidth] = useState(0);
  const [frozenColumnsScrollWidth, setFrozenColumnsScrollWidth] = useState(0);
  useEffect(() => {
    const newTableScrollHeight =
      (props.rowCount + 1) * props.rowHeight + props.headerHeight;
    setTableScrollHeight(newTableScrollHeight);
  }, [props.rowHeight, props.rowCount]);

  useEffect(() => {
    const newTableScrollWidth = props.columns.reduce(
      (width, column) => width + column.width,
      0,
    );
    setTableScrollWidth(newTableScrollWidth);
  }, [props.columns]);

  useEffect(() => {
    const newFrozenColumnsScrollWidth = props.frozenColumns.reduce(
      (width, column) => width + column.width,
      0,
    );
    setFrozenColumnsScrollWidth(newFrozenColumnsScrollWidth);
  }, [props.frozenColumns]);

  return {
    frozenColumnsScrollWidth,
    tableScrollHeight,
    tableScrollWidth,
  };
};

const useTotalVisibleRows = (props: DataTableProps) => {
  const [totalVisibleRows, setTotalVisibleRows] = useState(0);
  useEffect(() => {
    const totalRowsThatFit =
      (props.height - props.headerHeight) / props.rowHeight;
    const isLastRowCutOff = totalRowsThatFit % 1 !== 0;
    const newTotalVisibleRows = isLastRowCutOff
      ? Math.floor(totalRowsThatFit) + 1
      : Math.floor(totalRowsThatFit);
    setTotalVisibleRows(newTotalVisibleRows);
  }, [props.height, props.headerHeight, props.rowHeight]);

  return totalVisibleRows;
};

DataScroller.defaultProps = {
  frozenColumns: [],
  initialTopRowIndex: 0,
  onRowsRendered: ({}) => undefined,
  rowRenderer: defaultRowRenderer,
};

export default React.memo(DataScroller);
