/*@once*/

import type { Component } from 'solid-js';
import { invoke } from '@tauri-apps/api';
import { Route, Router, Routes } from '@solidjs/router';
// dashboard
import DashboardPage from './pages/DashboardPage';
//activities
import ActivitiesPage from './pages/ActivitiesPage';
import TimerPage from './pages/TimerPage';
import EditPage from './pages/EditPage';
import StateProvider from './StateContext';

const App: Component = () => {
  invoke<string>('greet', { name: 'World' }).then((res) => console.log(res));

  return (
    <Router>
      <StateProvider>
        <Routes>
          <Route path="/timer" component={TimerPage} />
          <Route path="/edit" component={EditPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/" component={ActivitiesPage} />
        </Routes>
      </StateProvider>
    </Router>
  );
};

export default App;
