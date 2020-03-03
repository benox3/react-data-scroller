import React from 'react';
import { DataScrollerContextProvider, getRowData } from './DataScrollerContext';
import { render, cleanup } from 'react-testing-library';

beforeEach(() => {
  cleanup();
});

describe('getRowData', () => {
  it('get the data correctly', () => {
    const data = {
      foo: 'foo',
      bar: 'bar',
      bam: 'bam',
    };

    const Child = (props: any) => {
      return (
        <div>
          {Object.entries(props.data).map(([key, value]) => (
            <div key={key}>{value}</div>
          ))}
        </div>
      );
    };

    const TestChild = getRowData()(Child);

    const TestWrapper = () => (
      <DataScrollerContextProvider data={data}>
        <TestChild />
      </DataScrollerContextProvider>
    );

    const { getByText } = render(<TestWrapper />);

    expect(getByText('foo')).toBeTruthy();
    expect(getByText('bar')).toBeTruthy();
    expect(getByText('bam')).toBeTruthy();
  });
  it('gets only the requested correctly', () => {
    const data = {
      foo: 'foo',
      bar: 'bar',
      bam: 'bam',
    };

    const Child = (props: any) => {
      return (
        <div>
          {Object.entries(props).map(([key, value]) => (
            <div key={key}>{value}</div>
          ))}
        </div>
      );
    };

    const TestChild = getRowData((_, data: any) => ({
      bar: data.bar,
    }))(Child);

    const TestWrapper = () => (
      <DataScrollerContextProvider data={data}>
        <TestChild />
      </DataScrollerContextProvider>
    );

    const { getByText } = render(<TestWrapper />);

    expect(getByText('bar')).toBeTruthy();
    expect(() => getByText('foo')).toThrow();
    expect(() => getByText('bam')).toThrow();
  });

  it('passes the props correctly', () => {
    const data = {
      bam: 'bam',
    };

    const Child = (props: any) => {
      return (
        <div>
          {Object.entries(props).map(([key, value]) => (
            <div key={key}>{value}</div>
          ))}
        </div>
      );
    };

    const TestChild = getRowData((props: any, data: any) => {
      return {
        ...props,
        bam: data.bam,
      };
    })(Child);

    const TestWrapper = () => (
      <DataScrollerContextProvider data={data}>
        <TestChild foo="foo" bar="bar" />
      </DataScrollerContextProvider>
    );

    const { getByText } = render(<TestWrapper />);

    expect(getByText('foo')).toBeTruthy();
    expect(getByText('bar')).toBeTruthy();
    expect(getByText('bam')).toBeTruthy();
  });
});
