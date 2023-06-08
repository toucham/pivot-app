import { Component, createSignal, Show, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ActivityJson } from '../model';
import styles from '../style/NewActivityPage.module.css';
import { appWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api';
import { StateContext } from '../StateContext';
import { formatTime2Ms } from '../utils/timer';

interface NewActivityStore {
  activity: ActivityJson;
  progress?: {
    t: string;
    time: {
      hr: number;
      min: number;
      sec: number;
    };
  };
}

interface IconSectionProps {
  codePoint: number;
}

const IconSection: Component<IconSectionProps> = (props) => {
  return (
    <div class={styles.cardIconSection}>
      <p>{String.fromCodePoint(props.codePoint)}</p>
    </div>
  );
};

const NewActivityPage: Component = () => {
  const [context, _] = useContext(StateContext);
  const [codePoint, setCodePoint] = createSignal(0x1f600);
  const [inputCP, setInputCP] = createSignal('1f600');
  const [state, setState] = createStore<NewActivityStore>({
    activity: {
      icon: 0x1f600,
      id: 0,
      name: '',
      time_ms: 0,
      rank: 1,
    },
  });

  const onClickCodePoint = () => {
    console.log(inputCP());
    const cp = parseInt(inputCP(), 16);
    setCodePoint(cp);
  };

  const onSubmit = async () => {
    if (state.activity.name == '') {
      return;
    }
    const new_act: ActivityJson = {
      id: Date.now(),
      rank: context.activities.length,
      icon: codePoint(),
      name: state.activity.name,
      time_ms: 0,
      desc: '',
    };
    if (state.progress != null && (state.progress.t == 'Goal' || state.progress.t == 'Limit')) {
      new_act.progress = {
        t: state.progress.t,
        time_ms: formatTime2Ms(state.progress.time),
      };
    }
    await invoke('create_activity', { new_act });
    appWindow.close();
  };

  return (
    <main class={styles.main}>
      <form class={styles.form}>
        <IconSection codePoint={codePoint()} />
        <div class={styles.inputCodePoint}>
          <input
            onInput={(e) => {
              setInputCP(e.target.value);
            }}
            type="text"
            placeholder="Emoji Code Point"
          />
          <button type="button" onClick={onClickCodePoint}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
        <div>
          <input
            onChange={(e) => {
              setState('activity', 'name', e.target.value);
            }}
            placeholder="Activity"
            type="text"
            name="activity"
            value={state.activity.name}
          />
        </div>
        <div>
          <label> Progress: </label>
          <select
            name="progress_type"
            onChange={(e) => {
              console.log(e.target.value);
            }}
          >
            <option value="" />
            <option value="Goal">goal</option>
            <option value="Limit">limit</option>
          </select>
          <Show when={state.activity.progress}>
            <div class={styles.timer}>
              <input type="number" placeholder="HH" min={0} max={24} />:
              <input type="number" placeholder="MM" min={0} max={59} />:
              <input type="number" placeholder="SS" min={0} max={59} />
            </div>
          </Show>
        </div>
      </form>
      <div class={styles.buttonConfirm}>
        <button onClick={onSubmit}>Confirm</button>
      </div>
    </main>
  );
};

export default NewActivityPage;
