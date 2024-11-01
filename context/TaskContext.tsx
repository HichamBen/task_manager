import React, {ReactNode, useLayoutEffect, useReducer} from 'react';
import {getTasks} from '../db/db-service';
import {FilterProps} from './FilterContext';

export type CheklistProps = {
  checkListItemId: string;
  content: string;
  isChecked: boolean;
};

export type TaskProps = {
  taskId: string;
  title?: string;
  description?: string;
  dueTime?: number;
  checkList?: CheklistProps[];
  isOver?: boolean;
  isCompleted?: boolean;
  createdAt?: string;
};

type TaskContextProviderProps = {
  children: ReactNode;
};

export type TaskActionProps =
  | {
      type:
        | 'CREATE_TASK'
        | 'CREATE_TASK'
        | 'EDIT_TASK'
        | 'OVER_DUEDATE'
        | 'DELETE_TASK';
      payload: TaskProps;
    }
  | {type: 'DB_TASKS'; initialState: TaskProps[]};

type TaskContextProps = {
  state: TaskProps[];
  dispatch: React.Dispatch<TaskActionProps>;
  searchAndFilter: (params: FilterProps) => void;
};

const initialState: TaskProps[] | [] = [];

function reducer(state: TaskProps[], action: TaskActionProps) {
  switch (action.type) {
    case 'DB_TASKS':
      return action.initialState ? action.initialState : state;

    case 'CREATE_TASK':
      return [action.payload, ...state];

    case 'EDIT_TASK':
      let tasks = state.map(item => {
        if (item.taskId === action.payload.taskId) {
          return {...item, ...action.payload};
        }
        return item;
      });
      return tasks;

    case 'OVER_DUEDATE':
      return state.map(item => {
        if (item.taskId === action.payload.taskId) {
          return {...item, ...action.payload};
        }
        return item;
      });

    case 'DELETE_TASK':
      return state.filter(item => item.taskId !== action.payload.taskId);

    default:
      return state;
  }
}

// task context
export const TaskContext = React.createContext({} as TaskContextProps);

// task context provider
export const TaskContextProvider = ({children}: TaskContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useLayoutEffect(() => {
    // GET All tasks from db;
    getTasks().then(result => {
      dispatch({
        type: 'DB_TASKS',
        initialState: result,
      });
    });
  }, []);

  const searchAndFilter = (params?: FilterProps) => {
    getTasks(params).then(result => {
      dispatch({
        type: 'DB_TASKS',
        initialState: result,
      });
    });
  };

  return (
    <TaskContext.Provider value={{state, dispatch, searchAndFilter}}>
      {children}
    </TaskContext.Provider>
  );
};
