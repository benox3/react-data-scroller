import React from 'react';
import { render } from 'react-testing-library';
import { ColumnProps, HeaderRendererArgs } from '../../types';
import Headers from './Headers';

describe('<Headers />', () => {
  test('rendering column header renderers properly', () => {
    function renderHeader(props: HeaderRendererArgs) {
      return <div>{props.label}</div>;
    }

    const columns: ColumnProps[] = [
      {
        headerRenderer: renderHeader,
        dataKey: 'fooKey',
        label: 'fooLabel',
        width: 42,
      },
      {
        headerRenderer: renderHeader,
        dataKey: 'barKey',
        label: 'barLabel',
        width: 42,
      },
    ];
    const headerHeight = 42;

    const { container } = render(
      <Headers columns={columns} headerHeight={headerHeight} />,
    );

    expect(container.textContent).toMatch('fooLabel');
    expect(container.textContent).toMatch('barLabel');
  });
});
