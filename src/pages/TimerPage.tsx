import { Component, onCleanup, onMount, useContext } from 'solid-js';
import { StateContext } from '../StateContext';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { listen, UnlistenFn, TauriEvent } from '@tauri-apps/api/event';

const TimerPage: Component = () => {
  const [state, _] = useContext(StateContext);
  let unlisten: UnlistenFn;

  onMount(async () => {
    await appWindow.setMaxSize(new LogicalSize(350, 100));
    unlisten = await listen(TauriEvent.WINDOW_MOVED, async () => {
      await appWindow.setSize(new LogicalSize(350, 100));
    });
  });

  onCleanup(() => {
    unlisten();
  });
  return <div> Timer page </div>;
};

export default TimerPage;
