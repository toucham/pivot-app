import { Component, JSX, onMount, ParentProps } from 'solid-js';
import styles from '../../style/Icon.module.css';

export interface IconProps extends ParentProps {
  size?: 's' | 'm' | 'l'; // default size is 'm'
  margin?: string;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> | undefined;
}

const Icon: Component<IconProps> = (props) => {
  let containerRef: HTMLButtonElement | undefined;
  onMount(() => {
    if (containerRef != undefined) {
      // width size
      if (props.size == 's') {
        containerRef.style.width = '1.75rem';
      } else if (props.size == 'm') {
        containerRef.style.width = '2.25rem';
      } else if (props.size == 'l') {
        containerRef.style.width = '3rem';
      }
      // container margin
      if (props.margin) {
        containerRef.style.margin = props.margin;
      }
    }
  });

  return (
    <button onClick={props.onClick} ref={containerRef} class={styles.icon}>
      {props.children}
    </button>
  );
};

export default Icon;
