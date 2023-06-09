import { createEffect, JSX, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Activity, Progress } from '../../model';
import styles from '../../style/activities/NewActivityModal.module.css';
import LeftArrowIcon from '../icons/LeftArrowIcon';

export interface NewActivityModalProps {
  open: boolean;
  onOk?: (params: Activity) => void;
  onCancel?: () => void;
  onBack?: () => void;
}

interface NewActivityStore {
  activity: Activity;
  progressTime: {
    hr: number;
    min: number;
    sec: number;
  };
}

function NewActivityModal(props: NewActivityModalProps): JSX.Element {
  const [state, setState] = createStore<NewActivityStore>({
    activity: {
      icon: 0x1f600,
      id: 0,
      name: '',
      timer: {
        time_ms: 0,
      },
      rank: 1,
    },
    progressTime: {
      hr: 0,
      min: 0,
      sec: 0,
    },
  });
  let modalRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (modalRef != undefined) {
      if (props.open) {
        modalRef.style.visibility = 'visible';
        modalRef.style.transform = 'none';
      } else {
        modalRef.style.transform = 'translateY(100%)';
        if (modalRef != undefined) {
          modalRef.style.visibility = 'hidden';
        }
      }
    }
  }, props.open);

  const onClickReset = () => {
    setState('activity', {
      icon: 0x1f600,
      id: 0,
      name: '',
      timer: {
        time_ms: 0,
      },
    });
  };

  const onClickBack = () => {
    if (props.onBack) {
      props.onBack();
    }
    onClickReset();
  };

  const onSelectChange = (
    e: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement },
  ) => {
    const prog_type = e.target.value;
    if (e.target.value != '' && (prog_type == 'Goal' || prog_type == 'Limit')) {
      const prog: Progress = {
        t: prog_type,
        time_ms: 0,
      };
      setState('activity', 'progress', prog);
    } else {
      console.error('Unidentified progress type');
    }
  };

  const validateInput = (): boolean => {
    if (state.activity.name == '') return false;
    return true;
  };

  const onSubmit = () => {
    if (props.onOk != undefined) {
      if (validateInput()) {
        props.onOk({ ...state.activity });
        onClickBack();
      }
    }
  };

  return (
    <div ref={modalRef} class={styles.modal}>
      <div>
        <div>
          <LeftArrowIcon size="s" onClick={onClickBack} />
        </div>
        <form>
          <div>
            <div class={styles.emojiIcon}>
              <p>{String.fromCodePoint(state.activity.icon)}</p>
            </div>
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
            <input type="color" name="color" />
          </div>
          <div>
            <label> Progress: </label>
            <select name="progress_type" onChange={onSelectChange}>
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
        <div class={styles.buttons}>
          <button onClick={onSubmit}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default NewActivityModal;
