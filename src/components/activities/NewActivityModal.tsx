import { createEffect, JSX } from 'solid-js';
import { Activity } from '../../model';
import styles from '../../style/activities/NewActivityModal.module.css';
import LeftArrowIcon from '../icons/LeftArrowIcon';

export interface NewActivityModalProps {
  open: boolean;
  onOk?: (params: Activity) => void;
  onCancel?: () => void;
  onBack?: () => void;
}

function NewActivityModal(props: NewActivityModalProps): JSX.Element {
  let modalRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (modalRef != undefined) {
      if (props.open) {
        modalRef.style.transform = 'none';
      } else {
        modalRef.style.transform = 'translateY(100%)';
      }
    }
  }, props.open);

  return (
    <div ref={modalRef} class={styles.modal}>
      <div>
        <div style="position: absolute">
          <LeftArrowIcon size="s" onClick={props.onBack} />
        </div>
        <form>
          <div>
            <div class={styles.emojiIcon}>
              <p>{String.fromCodePoint(0x1f600)}</p>
            </div>
          </div>
          <div>
            <input placeholder="Activity" type="text" name="activity" />
            <input type="color" name="color" />
          </div>
          <div>
            <label> Progress: </label>
            <select name="progress_type">
              <option value="" />
              <option value="goal">goal</option>
              <option value="limit">limit</option>
            </select>
            {/*
<div class={styles.timer}>
<input type="number" placeholder="HH" min={0} max={24} />:
<input type="number" placeholder="MM" min={0} max={59} />:
<input type="number" placeholder="SS" min={0} max={59} />
</div>
            */}
          </div>
        </form>
        <div class={styles.buttons}>
          <button> Cancel </button>
          <button> Confirm </button>
        </div>
      </div>
    </div>
  );
}

export default NewActivityModal;
