/*@once*/
import { Component, Show } from 'solid-js';
import { Route, Routes, useLocation } from '@solidjs/router';
import DashboardPage from './pages/DashboardPage';
import ActivitiesPage from './pages/ActivitiesPage';
import TimerPage from './pages/TimerPage';
import EditPage from './pages/EditPage';
import styles from './style/App.module.css';
import NewActivityPage from './pages/NewActivityPage';
import { appWindow } from '@tauri-apps/api/window';

const App: Component = () => {
  const loc = useLocation();
  const onClickMin = async () => {
    await appWindow.minimize();
  };

  const onClickClose = async () => {
    await appWindow.close();
  };

  return (
    <>
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
        <Route path="/new/:rank" component={NewActivityPage} />
        <Route path="/timer" component={TimerPage} />
        <Route path="/edit" component={EditPage} />
        <Route path="/dashboard" component={DashboardPage} />
      </Routes>
    </>
  );
};

export default App;
