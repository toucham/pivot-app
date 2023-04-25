import { Component, createSignal, For, onCleanup, onMount, useContext } from 'solid-js';
import styles from '../style/activities/ActivitiesPage.module.css';
import ActivityCard from '../components/activities/ActivityCard';
import { DashboardIcon, AddIcon, EditIcon } from '../components/icons';
import NewActivityModal from '../components/activities/NewActivityModal';
import { StateContext } from '../StateContext';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { listen, TauriEvent, UnlistenFn } from '@tauri-apps/api/event';

const ActivitiesPage: Component = () => {
  const [state, { addActivity }] = useContext(StateContext);
  const [isOpenedAdd, setIsOpenedAdd] = createSignal<boolean>(false);

  let wsDivRef: HTMLDivElement | undefined;
  let wsRef: HTMLDivElement | undefined;
  let unlisten: UnlistenFn;
  onMount(async () => {
    await appWindow.setSize(new LogicalSize(400, 600));
    unlisten = await listen(TauriEvent.WINDOW_MOVED, async () => {
      await appWindow.setSize(new LogicalSize(400, 600));
    });
    // whitespace div so it is scrollable to see last card
    if (wsDivRef != undefined && wsRef != undefined) {
      wsDivRef.style.height = `${wsRef.scrollHeight}px`;
    }
  });

  onCleanup(() => {
    unlisten();
  });

  return (
    <main>
      <div class={styles.cards}>
        <For each={state.activities}>{(a) => <ActivityCard activity={a} />}</For>
        <div class={styles.whitespace} ref={wsDivRef} />
      </div>
      <div ref={wsRef} class={styles.barContainer}>
        <menu class={styles.bottomBar}>
          <li>
            <DashboardIcon />
          </li>
          <li>
            <AddIcon
              onClick={() => {
                setIsOpenedAdd(true);
              }}
            />
          </li>
          <li>
            <EditIcon />
          </li>
        </menu>
      </div>
      <NewActivityModal
        onOk={addActivity}
        open={isOpenedAdd()}
        onBack={() => setIsOpenedAdd(false)}
      />
    </main>
  );
};

export default ActivitiesPage;
