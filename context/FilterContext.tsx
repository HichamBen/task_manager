import React, {ReactNode, createContext, useReducer} from 'react';

export type FilterProps = {
  search: string;
  sortBy: {
    oldest: boolean;
    withDue: boolean;
    withList: boolean;
    isOver: boolean;
  };
  createdAt?: string;
};

export type FilterActionProps =
  | {
      type: 'SEARCH';
      search: string;
    }
  | {
      type: 'FILTER';
      payload: {
        oldest: boolean;
        withDue: boolean;
        withList: boolean;
        isOver: boolean;
      };
    }
  | {
      type: 'BY_DATE';
      createdAt?: string;
    };

const reducer = (filter: FilterProps, action: FilterActionProps) => {
  switch (action.type) {
    case 'SEARCH':
      filter.search = action.search;
      return filter;
    case 'FILTER':
      filter.sortBy = {...filter.sortBy, ...action.payload};
      return filter;
    case 'BY_DATE':
      filter.createdAt = action.createdAt;
      return filter;
    default:
      return filter;
  }
};

type FilterContextProps = {
  filter: FilterProps;
  dispatcher: React.Dispatch<FilterActionProps>;
};

// task context
export const FilterContext = createContext({} as FilterContextProps);

let initialState = {
  search: '',
  sortBy: {
    oldest: false,
    withDue: true,
    withList: true,
    isOver: true,
  },
  createdAt: undefined,
};

type FilterContextProviderProps = {
  children: ReactNode;
};

export const FilterContextProvider = ({
  children,
}: FilterContextProviderProps) => {
  const [filter, dispatcher] = useReducer(reducer, initialState);

  return (
    <FilterContext.Provider value={{filter, dispatcher}}>
      {children}
    </FilterContext.Provider>
  );
};
