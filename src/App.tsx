/*@once*/

import { Component, Show } from 'solid-js';
import { appWindow } from '@tauri-apps/api/window';
import { Route, Routes, useLocation } from '@solidjs/router';
// dashboard
import DashboardPage from './pages/DashboardPage';
//activities
import ActivitiesPage from './pages/ActivitiesPage';
import TimerPage from './pages/TimerPage';
import EditPage from './pages/EditPage';
import StateProvider from './StateContext';
import styles from './style/App.module.css';

const App: Component = () => {
  const loc = useLocation();
  const onClickMin = async () => {
    await appWindow.minimize();
  };

  const onClickClose = async () => {
    await appWindow.close();
  };

  return (
    <StateProvider>
      <Show when={!loc.pathname.includes('/timer')}>
        <div class={styles.titlebar} data-tauri-drag-region>
          <span onClick={onClickMin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
            </svg>
          </span>
          <span onClick={onClickClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </div>
      </Show>
      <Routes>
        <Route path="/" component={ActivitiesPage} />
        <Route path="/timer" component={TimerPage} />
        <Route path="/edit" component={EditPage} />
        <Route path="/dashboard" component={DashboardPage} />
      </Routes>
    </StateProvider>
  );
};

export default App;
