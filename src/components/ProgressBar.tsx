import { Component, createEffect } from 'solid-js';
import styles from '../style/ProgressBar.module.css';

export interface ProgressBarProps {
  current: number;
  variant?: 'Goal' | 'Limit';
}

const ProgressBar: Component<ProgressBarProps> = (props) => {
  let bar: HTMLDivElement | undefined;

  createEffect(() => {
    if (bar) {
      if (props.variant != null && props.variant == 'Goal') {
        bar.style.backgroundColor = 'rgba(255, 5, 5, 0.7)';
      }
      if (props.current > 0) {
        const curr = props.current > 100 ? 100 : props.current;
        bar.style.width = curr + '%';
      }
    }
  }, props.current);

  return (
    <div class={styles.progress}>
      <div class={styles.bar} ref={bar} />
    </div>
  );
};

export default ProgressBar;
