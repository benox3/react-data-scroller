/* Dependencies */
import React, { Component, ReactNode, UIEvent } from "react";
import Headers from "./components/Headers";
import defaultRowRenderer from "./components/Row";
import Rows from "./components/Rows";
import { Row } from "./types";

/* Types */
import {
  CellRendererArgs,
  Column,
  DataTableProps,
  DataTableState,
  HeaderRendererArgs,
  OnRowsRenderedArgs,
  RowGetterArgs
} from "./types";

/* Styles */
import "./styles.css";

export default class DataScroller extends React.Component<
  DataTableProps,
  DataTableState
> {
  public static defaultProps = {
    frozenColumns: [],
    onRowsRendered: ({}) => undefined,
    rowRenderer: defaultRowRenderer
  };

  public static getDerivedStateFromProps(props: DataTableProps) {
    let tableScrollHeight = 0;
    for (let i = 0; i < props.rowCount; i++) {
      tableScrollHeight += props.rowHeight;
    }

    const tableScrollWidth = props.columns.reduce(
      (width, column) => width + column.width,
      0
    );
    const frozenColumnsWidth = props.frozenColumns.reduce(
      (width, column) => width + column.width,
      0
    );

    const totalVisibleRows = Math.floor(
      (props.height - props.headerHeight) / props.rowHeight
    );

    return {
      frozenColumnsWidth,
      tableScrollHeight,
      tableScrollWidth,
      totalVisibleRows
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
      totalVisibleRows: 0
    };

    this.tableScroller = React.createRef();
  }

  public componentDidMount() {
    this.props.onRowsRendered({
      overscanStartIndex: this.state.topRowIndex,
      overscanStopIndex: this.state.topRowIndex + this.state.totalVisibleRows,
      startIndex: this.state.topRowIndex,
      stopIndex: this.state.topRowIndex + this.state.totalVisibleRows
    });
  }
  public componentDidUpdate() {
    this.props.onRowsRendered({
      overscanStartIndex: this.state.topRowIndex,
      overscanStopIndex: this.state.topRowIndex + this.state.totalVisibleRows,
      startIndex: this.state.topRowIndex,
      stopIndex: this.state.topRowIndex + this.state.totalVisibleRows
    });
  }

  public handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollPosition = this.tableScroller.current
      ? this.tableScroller.current.scrollTop
      : 0;
    const newTopRowIndex = Math.round(scrollPosition / this.props.rowHeight);

    this.setState({
      topRowIndex: newTopRowIndex
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
      rows.push(this.props.rowGetter({ index: i }));
    }

    const RowRenderer = this.props.rowRenderer;

    return (
      <div
        ref={this.tableScroller}
        style={{ height: this.props.height, overflowY: "auto" }}
        onScroll={this.handleScroll}
        className="scroll"
      >
        <div
          style={{ height: this.state.tableScrollHeight, position: "relative" }}
        >
          <div
            className="sticky"
            style={{
              display: "flex",
              fontSize: "20px",
              top: 0
            }}
          >
            {/* Frozen */}
            <div
              style={{
                height: this.props.height,
                overflowX: "scroll",
                overflowY: "hidden",
                width: this.state.frozenColumnsWidth
              }}
            >
              <div style={{ width: this.state.frozenColumnsWidth }}>
                <Headers
                  columns={this.props.frozenColumns}
                  headerHeight={this.props.headerHeight}
                />
                <Rows
                  rows={rows}
                  columns={this.props.frozenColumns}
                  topRowIndex={this.state.topRowIndex}
                  rowHeight={this.props.rowHeight}
                  rowRenderer={this.props.rowRenderer}
                />
              </div>
            </div>

            {/*Standard */}
            <div
              style={{
                flex: 1,
                height: this.props.height,
                overflowX: "auto",
                overflowY: "hidden"
              }}
            >
              <div style={{ width: regularColumnsWidth }}>
                <Headers
                  columns={this.props.columns}
                  headerHeight={this.props.headerHeight}
                />
                <Rows
                  rows={rows}
                  columns={this.props.columns}
                  topRowIndex={this.state.topRowIndex}
                  rowHeight={this.props.rowHeight}
                  rowRenderer={this.props.rowRenderer}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
