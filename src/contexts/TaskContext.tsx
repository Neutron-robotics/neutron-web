import { createContext, Dispatch, useContext, useReducer } from 'react';

const TasksContext = createContext<any>(null);

const TasksDispatchContext = createContext<Dispatch<any>>(null as any);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

type TaskActionType = 'add' | 'commit' | 'delete';

interface TaskAction {
    type: TaskActionType;
    payload: any;
}

function tasksReducer(tasks: any, action: TaskAction) {
  switch (action.type) {
    case 'add': {
      return [...tasks, {
        id: action.payload.id,
        text: action.payload.text,
        done: false
      }];
    }
    case 'commit': {
      return tasks.map((t: any) => {
        if (t.id === action.payload.id) {
          return action.payload;
        } else {
          return t;
        }
      });
    }
    case 'delete': {
      return tasks.filter((t: any) => t.id !== action.payload.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
