import React, {ReactNode, useReducer} from 'react';
import {data} from '../components/tasks';

export type CheklistProps = {
  checkListItemId: number;
  content: string;
  isChecked: boolean;
};

export type TaskProps = {
  taskId: string;
  title?: string;
  description?: string;
  dueTime?: string[];
  checkList?: CheklistProps[];
};

type TaskContextProviderProps = {
  children: ReactNode;
};

type TaskActionProps = {
  type: string;
  payload: TaskProps;
};

type TaskContextProps = {
  state: {
    tasks: TaskProps[];
  };
  dispatch: React.Dispatch<TaskActionProps>;
};

const initialState = {
  tasks: data,
};

function reducer(state: {tasks: TaskProps[]}, action: TaskActionProps) {
  switch (action.type) {
    case 'CREATE_TASK':
      return {tasks: [...state.tasks, action.payload]};

    case 'EDIT_TASK':
      let tasks = state.tasks.map(item => {
        if (item.taskId === action.payload.taskId) {
          return {...item, ...action.payload};
        }
        return item;
      });

      return {tasks};
    case 'DELETE_TASK':
      return {
        tasks: state.tasks.filter(
          item => item.taskId !== action.payload.taskId,
        ),
      };
    default:
      return state;
  }
}

// task context
export const TaskContext = React.createContext({} as TaskContextProps);

// task context provider
export const TaskContextProvider = ({children}: TaskContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TaskContext.Provider value={{state, dispatch}}>
      {children}
    </TaskContext.Provider>
  );
};