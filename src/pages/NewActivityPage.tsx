import { Component, createSignal, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ActivityJson, Progress } from '../model';
import styles from '../style/NewActivityPage.module.css';
import { appWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api';
import { formatTime2Ms, TimeUtils } from '../utils/timer';
import { useParams } from '@solidjs/router';

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
  const [progress, setProgress] = createSignal<string | undefined>(undefined);
  const [progTimer, setProgTimer] = createSignal<TimeUtils>({ hr: 0, min: 0, sec: 0 });
  const [codePoint, setCodePoint] = createSignal(0x1f600);
  const [inputCP, setInputCP] = createSignal('1f600');
  const params = useParams<{ rank: string }>();
  const [state, setState] = createStore<NewActivityStore>({
    activity: {
      icon: 0x1f600,
      id: 0,
      name: '',
      time_ms: 0,
      rank: 1,
      desc: '',
      progress: undefined,
    },
  });

  const onClickCodePoint = () => {
    console.log(inputCP());
    const cp = parseInt(inputCP(), 16);
    setCodePoint(cp);
  };

  const onChangeProgTimer = (type: string, value: number) => {
    const progT = progTimer();
    switch (type) {
      case 'hr': {
        if (typeof value == 'number' && value >= 0 && value <= 24) {
          setProgTimer({ ...progT, hr: value });
        }
        break;
      }
      case 'min': {
        if (typeof value == 'number' && value >= 0 && value <= 59) {
          setProgTimer({ ...progT, min: value });
        }
        break;
      }
      case 'sec': {
        if (typeof value == 'number' && value >= 0 && value <= 59) {
          setProgTimer({ ...progT, sec: value });
        }
        break;
      }
      default: {
        console.error('Unidentified type of progress timer');
      }
    }
  };

  const onSubmit = async () => {
    if (state.activity.name == '') {
      return;
    }
    const progstate = progress();
    let prog: Progress | undefined = undefined;
    if (progstate) {
      prog = {
        t: progstate as 'Goal' | 'Limit',
        time_ms: formatTime2Ms(progTimer()),
      };
    }
    const new_act: ActivityJson = {
      id: Date.now(),
      rank: parseInt(params.rank),
      icon: codePoint(),
      name: state.activity.name,
      time_ms: 0,
      progress: prog,
      desc: state.activity.desc,
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
        <div class={styles.descbox}>
          <label> Description: </label>
          <textarea
            maxlength={50}
            onInput={(e) => {
              setState('activity', 'desc', e.target.value);
            }}
          />
        </div>
        <div>
          <label> Progress: </label>
          <select
            name="progress_type"
            onChange={(e) => {
              if (e.target.value != 'Goal' && e.target.value != 'Limit') {
                setProgress(undefined);
              } else {
                setProgress(e.target.value);
              }
            }}
          >
            <option value="" />
            <option value="Goal">Goal</option>
            <option value="Limit">Limit</option>
          </select>
          <Show when={progress() != undefined}>
            <div class={styles.timer}>
              <input
                type="number"
                placeholder="HH"
                onInput={(e) => onChangeProgTimer('hr', parseInt(e.target.value))}
                min={0}
                max={24}
              />
              :
              <input
                type="number"
                placeholder="MM"
                onInput={(e) => onChangeProgTimer('min', parseInt(e.target.value))}
                min={0}
                max={59}
              />
              :
              <input
                type="number"
                placeholder="SS"
                onInput={(e) => onChangeProgTimer('sec', parseInt(e.target.value))}
                min={0}
                max={59}
              />
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
