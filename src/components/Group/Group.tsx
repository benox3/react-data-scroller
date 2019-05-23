import React from 'react';

export type Props<GroupData> = {
  children?: React.ReactNode;
  groupData: any;
  headerRenderer?: React.ComponentType<{
    groupData: GroupData;
    width: number;
  }>;
};

// @ts-ignore
function Group(props: Props) {
  return null;
}

// Used for identifying the component type when iterating through children
Group.__Group__ = true;

export default Group;
