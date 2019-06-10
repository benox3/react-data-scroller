import { renderHook } from 'react-hooks-testing-library';
import useTableScrollDimensions from './useTableScrollDimensions';

describe('useTableScrollDimensions()', () => {
  it('is a function', () => {
    expect(typeof useTableScrollDimensions).toBe('function');
  });

  describe('returning the total scroll width of frozen columns', () => {
    const props = {
      columns: [],
      frozenColumns: [{ width: 10 }, { width: 20 }],
      groupHeaderHeight: 0,
      headerHeight: 0,
      rowCount: 0,
      rowHeight: 0,
    };

    it('returns the sum of all individual frozen column widths', () => {
      const { result } = renderHook(() => useTableScrollDimensions(props));
      expect(result.current.frozenColumnsScrollWidth).toBe(30);
    });
  });

  describe('returning the total scroll width of table columns', () => {
    const props = {
      columns: [{ width: 10 }, { width: 20 }],
      frozenColumns: [],
      groupHeaderHeight: 0,
      headerHeight: 0,
      rowCount: 0,
      rowHeight: 0,
    };

    it('returns the sum of all individual table column widths', () => {
      const { result } = renderHook(() => useTableScrollDimensions(props));
      expect(result.current.tableScrollWidth).toBe(30);
    });
  });

  describe('returning the total scroll height of the table', () => {
    const props = {
      columns: [],
      frozenColumns: [],
      groupHeaderHeight: 3,
      headerHeight: 4,
      rowCount: 1,
      rowHeight: 10,
    };

    it('returns the sum height of (rowCount + 1) rows and all headers', () => {
      const { result } = renderHook(() => useTableScrollDimensions(props));
      expect(result.current.tableScrollHeight).toBe(27);
    });
  });

  describe('updating as props change', () => {
    const initialProps = {
      columns: [{ width: 10 }, { width: 20 }],
      frozenColumns: [{ width: 10 }, { width: 20 }],
      groupHeaderHeight: 3,
      headerHeight: 4,
      rowCount: 1,
      rowHeight: 10,
    };

    describe('when props.rowHeight changes', () => {
      const nextProps = {
        ...initialProps,
        rowHeight: 20,
      };

      it('updates the tableScrollHeight', () => {
        const { result, rerender } = renderHook(
          (props: any) => useTableScrollDimensions(props),
          { initialProps },
        );
        expect(result.current.tableScrollHeight).toBe(27);

        rerender(nextProps);
        expect(result.current.tableScrollHeight).toBe(47);
      });
    });

    describe('when props.rowCount changes', () => {
      const nextProps = {
        ...initialProps,
        rowCount: 2,
      };

      it('updates the tableScrollHeight', () => {
        const { result, rerender } = renderHook(
          (props: any) => useTableScrollDimensions(props),
          { initialProps },
        );
        expect(result.current.tableScrollHeight).toBe(27);

        rerender(nextProps);
        expect(result.current.tableScrollHeight).toBe(37);
      });
    });

    describe('when props.columns changes', () => {
      const nextProps = {
        ...initialProps,
        columns: [{ width: 10 }],
      };

      it('updates the tableScrollWidth', () => {
        const { result, rerender } = renderHook(
          (props: any) => useTableScrollDimensions(props),
          { initialProps },
        );
        expect(result.current.tableScrollWidth).toBe(30);

        rerender(nextProps);
        expect(result.current.tableScrollWidth).toBe(10);
      });
    });

    describe('when props.frozenColumns changes', () => {
      const nextProps = {
        ...initialProps,
        frozenColumns: [{ width: 10 }],
      };

      it('updates the tableScrollWidth', () => {
        const { result, rerender } = renderHook(
          (props: any) => useTableScrollDimensions(props),
          { initialProps },
        );
        expect(result.current.frozenColumnsScrollWidth).toBe(30);

        rerender(nextProps);
        expect(result.current.frozenColumnsScrollWidth).toBe(10);
      });
    });
  });
});
