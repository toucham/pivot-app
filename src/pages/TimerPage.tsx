import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
  useContext,
} from 'solid-js';
import { StateContext } from '../StateContext';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import styles from '../style/TimerPage.module.css';
import ActivityCard from '../components/activities/ActivityCard';
import { Activity } from '../model';

const TimerPage: Component = () => {
  const [state, _] = useContext(StateContext);
  const [act, setAct] = createSignal<Activity>();

  createEffect(() => {
    if (state.currId != 0) {
      setAct(state.activities.find((a) => a.id == state.currId));
    }
  }, state.currId);

  onMount(() => {
    appWindow.setSize(new LogicalSize(300, 100));
    appWindow.setAlwaysOnTop(true);
  });

  onCleanup(() => {
    appWindow.setAlwaysOnTop(false);
    appWindow.setSize(new LogicalSize(340, 600));
  });

  return (
    <main data-tauri-drag-region class={styles.page}>
      <Show when={act()}>{(a) => <ActivityCard activity={a()} />}</Show>
    </main>
  );
};

export default TimerPage;
