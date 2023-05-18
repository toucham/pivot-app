import { Component, createSignal, For, onCleanup, onMount, useContext } from 'solid-js';
import styles from '../style/activities/ActivitiesPage.module.css';
import ActivityCard from '../components/activities/ActivityCard';
import NewActivityModal from '../components/activities/NewActivityModal';
import { StateContext } from '../StateContext';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { listen, TauriEvent, UnlistenFn } from '@tauri-apps/api/event';
import DashboardIcon from '../components/icons/DashboardIcon';
import AddIcon from '../components/icons/AddIcon';
import EditIcon from '../components/icons/EditIcon';

const ActivitiesPage: Component = () => {
  const [state, { addActivity }] = useContext(StateContext);
  const [isOpenedAdd, setIsOpenedAdd] = createSignal<boolean>(false);

  let wsDivRef: HTMLDivElement | undefined;
  let unlisten: Promise<UnlistenFn>;

  onMount(() => {
    appWindow.setSize(new LogicalSize(340, 600));
    unlisten = listen(TauriEvent.WINDOW_MOVED, async () => {
      await appWindow.setSize(new LogicalSize(340, 600));
    });
  });

  onCleanup(() => {
    unlisten.then((u) => u());
  });

  return (
    <main class={styles.main}>
      <div class={styles.cardsContainer}>
        <div class={styles.cards}>
          <For each={state.activities}>
            {(a) => (
              <div class={styles.cardBorder}>
                <ActivityCard activity={a} />
              </div>
            )}
          </For>
          <div class={styles.whitespace} ref={wsDivRef} />
        </div>
      </div>
      <NewActivityModal
        onOk={addActivity}
        open={isOpenedAdd()}
        onBack={() => setIsOpenedAdd(false)}
      />
      <div class={styles.barContainer}>
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
    </main>
  );
};

export default ActivitiesPage;
