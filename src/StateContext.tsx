import { Component, createContext, ParentProps } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Activity } from './model';

const mock: Activity[] = [
  {
    id: 1,
    icon: 0x1f600,
    name: 'Personal Project',
    timer: {
      ongoing: false,
      time: 0,
    },
  },
  {
    id: 2,
    icon: 0x1f3c3,
    name: 'Workout',
    progress: {
      type: 'goal',
      time: 50,
    },
    timer: {
      ongoing: false,
      time: 25,
    },
  },
  {
    id: 3,
    icon: 0x1f3ae,
    name: 'Gaming',
    progress: {
      type: 'limit',
      time: 100,
    },
    timer: {
      ongoing: false,
      time: 25,
    },
  },
  {
    id: 4,
    icon: 0x1f4da,
    name: 'Homework',
    timer: {
      ongoing: false,
      time: 0,
    },
  },
  {
    id: 5,
    icon: 0x1f3b6,
    name: 'Music',
    timer: {
      ongoing: false,
      time: 0,
    },
  },
];

interface StateStore {
  activities: Activity[];
}

interface OptStore {
  addActivity: (a: Activity) => void;
  removeActivity: (id: number) => void;
}

type StoreContext = [StateStore, OptStore];

export const StateContext = createContext<StoreContext>([
  { activities: [] },
  {
    addActivity(a: Activity) {
      console.log(a.id);
    },
    removeActivity(id: number) {
      console.log(id);
    },
  },
]);

const StateProvider: Component<ParentProps> = (props) => {
  const [state, setState] = createStore<StateStore>({
    activities: mock,
  });

  const context: [StateStore, OptStore] = [
    state,
    {
      addActivity(act: Activity) {
        console.log('state context: ');
        console.log(act);
        setState('activities', (a) => [...a, act]);
      },
      removeActivity(id: number) {
        setState('activities', (a) => a.filter((e) => e.id != id));
      },
    },
  ];
  return <StateContext.Provider value={context}>{props.children}</StateContext.Provider>;
};

export default StateProvider;
