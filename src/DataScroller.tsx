/* Dependencies */
import React, {Component, ReactNode, UIEvent} from 'react';

/* Types */
import {
  CellRendererArgs,
  Column,
  DataTableProps,
  DataTableState,
  HeaderRendererArgs,
  OnRowsRenderedArgs,
  RowGetterArgs,
} from './types';

/* Styles */
import './styles.css';

export default class DataScroller extends React.Component<
  DataTableProps,
  DataTableState
> {
  public static defaultProps = {
    frozenColumns: [],
    onRowsRendered: ({}) => undefined,
  };

  public static getDerivedStateFromProps(props: DataTableProps) {
    let tableScrollHeight = 0;
    for (let i = 0; i < props.rowCount; i++) {
      tableScrollHeight += props.rowHeight;
    }

    const tableScrollWidth = props.columns.reduce(
      (width, column) => width + column.width,
      0,
    );
    const frozenColumnsWidth = props.frozenColumns.reduce(
      (width, column) => width + column.width,
      0,
    );

    const totalVisibleRows = Math.floor(
      (props.height - props.headerHeight) / props.rowHeight,
    );

    return {
      frozenColumnsWidth,
      tableScrollHeight,
      tableScrollWidth,
      totalVisibleRows,
    };
  }
  public tableScroller = React.createRef<HTMLDivElement>();

  constructor(props: DataTableProps) {
    super(props);
    this.state = {
      frozenColumnsWidth: 0,
      leftColumnIndex: 0,
      tableScrollHeight: 0,
      tableScrollWidth: 0,
      topRowIndex: 0,
      totalVisibleRows: 0,
    };

    this.tableScroller = React.createRef();
  }

  public componentDidMount() {
      this.props.onRowsRendered({
        overscanStartIndex: this.state.topRowIndex,
        overscanStopIndex: this.state.topRowIndex + this.state.totalVisibleRows,
        startIndex: this.state.topRowIndex,
        stopIndex: this.state.topRowIndex + this.state.totalVisibleRows,
      });
  }
  public componentDidUpdate() {
      this.props.onRowsRendered({
        overscanStartIndex: this.state.topRowIndex,
        overscanStopIndex: this.state.topRowIndex + this.state.totalVisibleRows,
        startIndex: this.state.topRowIndex,
        stopIndex: this.state.topRowIndex + this.state.totalVisibleRows,
      });
  }

  public handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollPosition = this.tableScroller.current
      ? this.tableScroller.current.scrollTop
      : 0;
    const newTopRowIndex = Math.round(scrollPosition / this.props.rowHeight);

    this.setState({
      topRowIndex: newTopRowIndex,
    });
  };

  public render() {
    const regularColumnsWidth = this.state.tableScrollWidth;
    const rows = [];

    for (
      let i = this.state.topRowIndex;
      i < this.state.topRowIndex + this.state.totalVisibleRows;
      i++
    ) {
      rows.push(this.props.rowGetter({index: i}));
    }

    return (
      <div
        ref={this.tableScroller}
        style={{height: this.props.height, overflowY: 'auto'}}
        onScroll={this.handleScroll}
        className="scroll">
        <div
          style={{height: this.state.tableScrollHeight, position: 'relative'}}>
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
                height: this.props.height,
                overflowX: 'scroll',
                overflowY: 'hidden',
                width: this.state.frozenColumnsWidth,
              }}>
              <div style={{width: this.state.frozenColumnsWidth}}>
                {/*Headers*/}
                <div style={{display: 'flex', height: this.props.headerHeight}}>
                  {this.props.frozenColumns.map(column => (
                    <div style={{width: column.width}}>
                      {(column.headerRenderer &&
                        column.headerRenderer(column)) || <div />}
                    </div>
                  ))}
                </div>

                {/*Rows*/}
                <div>
                  {rows.map((row = {}, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{display: 'flex', height: this.props.rowHeight}}>
                      {this.props.frozenColumns.map((column, index) => (
                        <div style={{width: column.width}}>
                          {column.cellRenderer ? (
                            column.cellRenderer({
                              cellData: row[column.dataKey],
                              columnData: column.columnData,
                              columnIndex: index,
                              dataKey: column.dataKey,
                              rowData: row,
                              rowIndex: rowIndex + this.state.topRowIndex,
                            })
                          ) : (
                            <div>{row[column.dataKey]}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/*Standard */}
            <div
              style={{
                flex: 1,
                height: this.props.height,
                overflowX: 'auto',
                overflowY: 'hidden',
              }}>
              <div style={{width: regularColumnsWidth}}>
                {/*Headers*/}
                <div style={{display: 'flex', height: this.props.headerHeight}}>
                  {this.props.columns.map(
                    ({
                      columnData,
                      dataKey,
                      headerRenderer,
                      width,
                      label,
                    }: Column) => (
                      <div style={{width}}>
                        {headerRenderer &&
                          headerRenderer({columnData, dataKey, label})}
                      </div>
                    ),
                  )}
                </div>

                {/*Rows*/}
                <div
                  style={{
                    height: this.props.height - this.props.headerHeight,
                  }}>
                  {rows.map((row = {}, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{display: 'flex', height: this.props.rowHeight}}>
                      {this.props.columns.map((column, index) => (
                        <div style={{width: column.width}}>
                          {column.cellRenderer ? (
                            column.cellRenderer({
                              cellData: row[column.dataKey],
                              columnData: column.columnData,
                              columnIndex: index,
                              dataKey: column.dataKey,
                              rowData: row,
                              rowIndex: rowIndex + this.state.topRowIndex,
                            })
                          ) : (
                            <div>{row[column.dataKey]}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
