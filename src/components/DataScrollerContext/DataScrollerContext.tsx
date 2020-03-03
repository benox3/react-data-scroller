import React, { useContext } from 'react';

type DataScrollerContextValue = {
  data: any;
};

export const DataScrollerContext = React.createContext<
  DataScrollerContextValue
>({
  data: {},
});

type ComponentProps<Data = any> = {
  data: Data;
  children: React.ReactNode;
};

export function DataScrollerContextProvider<Data>(props: ComponentProps<Data>) {
  return (
    <DataScrollerContext.Provider value={{ data: props.data }}>
      {props.children}
    </DataScrollerContext.Provider>
  );
}

function defaultMapContextDataValueToProps<Props, Data>(
  props: Props,
  data: Data,
): any {
  return { ...props, data };
}

type MapContextValueToProps<OuterProps, Data, InnerProps> = (
  props: OuterProps,
  data: Data,
) => InnerProps;

export function getRowData<OuterProps, Data, InnerProps>(
  mapContextValueToProps?: MapContextValueToProps<OuterProps, Data, InnerProps>,
) {
  return function(Component: React.FC<InnerProps>) {
    const MemoizedComponent = (React.memo(Component) as any) as React.FC<
      InnerProps
    >;

    return function<P extends OuterProps>(props: P) {
      const contextValue = useContext(DataScrollerContext);

      const propsWithState = mapContextValueToProps
        ? mapContextValueToProps(props, contextValue.data)
        : (defaultMapContextDataValueToProps<OuterProps, Data>(
            props,
            contextValue.data,
          ) as InnerProps);

      return <MemoizedComponent {...propsWithState} />;
    };
  };
}
