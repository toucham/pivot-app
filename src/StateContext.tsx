import { Component, createContext, ParentProps } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Activity, ActivityJson } from './model';

interface StateStore {
  activities: Activity[];
  currId: number;
}

interface OptStore {
  initActivities: (a: ActivityJson[]) => void;
  addActivity: (a: Activity) => void;
  removeActivity: (id: number) => void;
  focusActivity: (id: number) => void;
  unfocusActivity: () => void;
  addCurrTime: (ms: number) => void;
  deleteActivity: (id: number) => void;
}

type StoreContext = [StateStore, OptStore];

export const StateContext = createContext<StoreContext>([
  { activities: [], currId: 0 },
  {
    initActivities(a) {
      console.log('initActivities: ' + JSON.stringify(a));
    },
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
    deleteActivity(id: number) {
      console.log('delete activity: ', id);
    },
  },
]);

const StateProvider: Component<ParentProps> = (props) => {
  const [state, setState] = createStore<StateStore>({
    activities: [],
    currId: 0,
  });

  const context: [StateStore, OptStore] = [
    state,
    {
      initActivities(acts) {
        const act: Activity[] = acts.map((a) => ({
          ...a,
          timer: {
            time_ms: a.time_ms,
          },
        }));
        setState('activities', act);
      },
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
          'time_ms',
          (t) => t + ms,
        );
      },
      deleteActivity(id) {
        setState('activities', (activities) => activities.filter((a) => a.id != id));
      },
    },
  ];
  return <StateContext.Provider value={context}>{props.children}</StateContext.Provider>;
};

export default StateProvider;
