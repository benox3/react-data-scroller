import { renderHook } from 'react-hooks-testing-library';
import useTotalVisibleRows from './useTotalVisibleRows';

describe('useTotalVisibleRows()', () => {
  it('is a function', () => {
    expect(typeof useTotalVisibleRows).toBe('function');
  });

  describe('returning the number of rows that can fit', () => {
    describe('when all rows would be completely visible', () => {
      it('returns only the number of rows that are visible', () => {
        const props = {
          groupHeaderHeight: 30,
          height: 100,
          headerHeight: 20,
          rowHeight: 10,
        };

        const { result } = renderHook(() => useTotalVisibleRows(props));
        expect(result.current).toBe(5);
      });
    });

    describe('when a row would only be partially visible', () => {
      it('rounds up to include that row', () => {
        const props = {
          groupHeaderHeight: 35,
          height: 100,
          headerHeight: 20,
          rowHeight: 10,
        };

        const { result } = renderHook(() => useTotalVisibleRows(props));
        expect(result.current).toBe(4);
      });
    });

    describe('when no rows would be visible', () => {
      it('defaults to 0 instead of negative number', () => {
        const props = {
          groupHeaderHeight: 35,
          height: 10,
          headerHeight: 20,
          rowHeight: 10,
        };

        const { result } = renderHook(() => useTotalVisibleRows(props));
        expect(result.current).toBe(0);
      });
    });
  });

  describe('updating as props change', () => {
    const initialProps = {
      groupHeaderHeight: 30,
      height: 100,
      headerHeight: 20,
      rowHeight: 10,
    };

    it('updates when props.groupHeaderHeight changes', async () => {
      const nextProps = {
        ...initialProps,
        groupHeaderHeight: 40,
      };

      const { result, rerender } = renderHook(
        (props: any) => useTotalVisibleRows(props),
        { initialProps },
      );
      expect(result.current).toBe(5);

      rerender(nextProps);
      expect(result.current).toBe(4);
    });

    it('updates when props.headerHeight changes', async () => {
      const nextProps = {
        ...initialProps,
        headerHeight: 30,
      };

      const { result, rerender } = renderHook(
        (props: any) => useTotalVisibleRows(props),
        { initialProps },
      );
      expect(result.current).toBe(5);

      rerender(nextProps);
      expect(result.current).toBe(4);
    });

    it('updates when props.height changes', async () => {
      const nextProps = {
        ...initialProps,
        height: 90,
      };

      const { result, rerender } = renderHook(
        (props: any) => useTotalVisibleRows(props),
        { initialProps },
      );
      expect(result.current).toBe(5);

      rerender(nextProps);
      expect(result.current).toBe(4);
    });

    it('updates when props.rowHeight changes', async () => {
      const nextProps = {
        ...initialProps,
        rowHeight: 20,
      };

      const { result, rerender } = renderHook(
        (props: any) => useTotalVisibleRows(props),
        { initialProps },
      );
      expect(result.current).toBe(5);

      rerender(nextProps);
      expect(result.current).toBe(2);
    });
  });
});
