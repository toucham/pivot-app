import { Component, onMount } from 'solid-js';
import styles from '../style/ProgressBar.module.css';

export interface ProgressBarProps {
  current: number;
  variant?: 'goal' | 'limit';
}

const ProgressBar: Component<ProgressBarProps> = (props) => {
  let bar: HTMLDivElement | undefined;
  onMount(() => {
    if (bar) {
      if (props.variant != null && props.variant == 'limit') {
        bar.style.backgroundColor = 'red';
      }
      if (props.current <= 100 && props.current > 0) {
        bar.style.width = props.current + '%';
      }
    }
  });

  return (
    <div class={styles.progress}>
      <div class={styles.bar} ref={bar}></div>
    </div>
  );
};

export default ProgressBar;
