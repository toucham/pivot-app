import { Component, createSignal, For, onMount } from 'solid-js';
import styles from '../../style/activities/ActivitiesPage.module.css';
import { Activity } from '../../model';
import ActivityCard from '../../components/activities/ActivityCard';
import { DashboardIcon, AddIcon, EditIcon } from '../../components/icons';
import NewActivityModal from '../../components/activities/NewActivityModal';

const acts: Activity[] = [
  {
    icon: 0x1f600,
    name: 'Personal Project',
    timer: {
      ongoing: false,
      currTimer: 0,
    },
  },
  {
    icon: 0x1f3c3,
    name: 'Workout',
    progress: {
      type: 'goal',
      complete: 50,
    },
    timer: {
      ongoing: false,
      currTimer: 0,
    },
  },
  {
    icon: 0x1f3ae,
    name: 'Gaming',
    timer: {
      ongoing: false,
      currTimer: 0,
    },
  },
  {
    icon: 0x1f4da,
    name: 'Homework',
    timer: {
      ongoing: false,
      currTimer: 0,
    },
  },
  {
    icon: 0x1f3b6,
    name: 'Music',
    timer: {
      ongoing: false,
      currTimer: 0,
    },
  },
];

const ActivitiesPage: Component = () => {
  const [activities, setActivities] = createSignal<Activity[] | null>(acts);
  const [isOpenedAdd, setIsOpenedAdd] = createSignal<boolean>(true);

  let wsDivRef: HTMLDivElement | undefined;
  let wsRef: HTMLDivElement | undefined;
  onMount(() => {
    // whitespace div so it is scrollable to see last card
    if (wsDivRef != undefined && wsRef != undefined) {
      wsDivRef.style.height = `${wsRef.scrollHeight}px`;
    }
  });

  return (
    <main>
      <div class={styles.cards}>
        <For each={activities()}>{(a) => <ActivityCard activity={a} />}</For>
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
      <NewActivityModal open={isOpenedAdd()} onBack={() => setIsOpenedAdd(false)} />
    </main>
  );
};

export default ActivitiesPage;
