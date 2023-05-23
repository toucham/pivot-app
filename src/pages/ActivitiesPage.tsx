import { Component, createSignal, For, onMount, useContext } from 'solid-js';
import styles from '../style/activities/ActivitiesPage.module.css';
import ActivityCard from '../components/activities/ActivityCard';
import NewActivityModal from '../components/activities/NewActivityModal';
import { StateContext } from '../StateContext';
import { WebviewWindow } from '@tauri-apps/api/window';
import DashboardIcon from '../components/icons/DashboardIcon';
import AddIcon from '../components/icons/AddIcon';
import EditIcon from '../components/icons/EditIcon';
import { invoke } from '@tauri-apps/api';
import { TauriEvent } from '@tauri-apps/api/event';
import { ActivityJson } from '../model';

const ActivitiesPage: Component = () => {
  const [state, { addActivity }] = useContext(StateContext);
  const [isOpenedAdd, setIsOpenedAdd] = createSignal<boolean>(false);
  const [_, { initActivities }] = useContext(StateContext);

  let wsDivRef: HTMLDivElement | undefined;

  let wv: WebviewWindow;

  const onClickAdd = async () => {
    await invoke('new_window');
    const addWindow = WebviewWindow.getByLabel('new_window');
    addWindow?.listen(TauriEvent.WINDOW_DESTROYED, () => {
      init();
    });
  };

  const init = async () => {
    const acts = await invoke<ActivityJson[]>('query_activity');
    initActivities(acts);
  };

  onMount(async () => {
    init();
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
            <DashboardIcon onClick={() => wv.emit('new-activity-page')} />
          </li>
          <li>
            <AddIcon onClick={onClickAdd} />
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
