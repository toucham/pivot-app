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
import { listen, UnlistenFn, TauriEvent } from '@tauri-apps/api/event';
import styles from '../style/TimerPage.module.css';
import ActivityCard from '../components/activities/ActivityCard';
import { Activity } from '../model';

const TimerPage: Component = () => {
  const [state, _] = useContext(StateContext);
  const [act, setAct] = createSignal<Activity>();
  let unlisten: Promise<UnlistenFn>;

  createEffect(() => {
    if (state.currId != 0) {
      setAct(state.activities.find((a) => a.id == state.currId));
    }
  }, state.currId);

  onMount(() => {
    appWindow.setSize(new LogicalSize(300, 100));
    unlisten = listen(TauriEvent.WINDOW_MOVED, async () => {
      await appWindow.setSize(new LogicalSize(300, 100));
    });
    appWindow.setAlwaysOnTop(true);
  });

  onCleanup(() => {
    unlisten.then((u) => u());
    appWindow.setAlwaysOnTop(false);
  });

  return (
    <main data-tauri-drag-region class={styles.page}>
      <Show when={act()}>{(a) => <ActivityCard activity={a()} />}</Show>
    </main>
  );
};

export default TimerPage;
