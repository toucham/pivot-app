import { Component, createContext, ParentProps } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Activity } from './model';

const mock: Activity[] = [
  {
    id: 1,
    icon: 0x1f600,
    name: 'Personal Project',
    timer: {
      time: 1000000,
    },
  },
  {
    id: 2,
    icon: 0x1f3c3,
    name: 'Workout',
    progress: {
      type: 'goal',
      time: 600000,
    },
    timer: {
      time: 240000,
    },
  },
  {
    id: 3,
    icon: 0x1f3ae,
    name: 'Gaming',
    progress: {
      type: 'limit',
      time: 10000,
    },
    timer: {
      time: 1000,
    },
  },
  {
    id: 4,
    icon: 0x1f4da,
    name: 'Homework',
    timer: {
      time: 0,
    },
  },
  {
    id: 5,
    icon: 0x1f3b6,
    name: 'Music',
    timer: {
      time: 0,
    },
  },
  {
    id: 6,
    icon: 0x1f57a,
    name: 'Entertainment',
    timer: {
      time: 0,
    },
  },
];

interface StateStore {
  activities: Activity[];
  currId: number;
}

interface OptStore {
  addActivity: (a: Activity) => void;
  removeActivity: (id: number) => void;
  focusActivity: (id: number) => void;
  unfocusActivity: () => void;
  addCurrTime: (ms: number) => void;
}

type StoreContext = [StateStore, OptStore];

export const StateContext = createContext<StoreContext>([
  { activities: [], currId: 0 },
  {
    addActivity(a: Activity) {
      console.log(a.id);
    },
    removeActivity(id: number) {
      console.log(id);
    },
    focusActivity(id: number) {
      // pass in proxy so that all states change
      console.log(id);
    },
    unfocusActivity() {
      console.log('unfocus activity');
    },
    addCurrTime(ms: number) {
      console.log('ms added: ' + ms);
    },
  },
]);

const StateProvider: Component<ParentProps> = (props) => {
  const [state, setState] = createStore<StateStore>({
    activities: mock,
    currId: 0,
  });

  const context: [StateStore, OptStore] = [
    state,
    {
      addActivity(act: Activity) {
        act.id = Date.now();
        setState('activities', (a) => [...a, act]);
      },
      removeActivity(id: number) {
        setState('activities', (a) => a.filter((e) => e.id != id));
      },
      focusActivity(id: number) {
        setState('currId', id);
      },
      unfocusActivity() {
        setState('currId', 0);
      },
      addCurrTime(ms: number) {
        setState(
          'activities',
          (a) => a.id == state.currId,
          'timer',
          'time',
          (t) => t + ms,
        );
      },
    },
  ];
  return <StateContext.Provider value={context}>{props.children}</StateContext.Provider>;
};

export default StateProvider;
