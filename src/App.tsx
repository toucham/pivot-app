/*@once*/

import type { Component } from 'solid-js';
import { invoke } from '@tauri-apps/api';
import { Route, Router, Routes } from '@solidjs/router';
// dashboard
import DashboardPage from './pages/DashboardPage';
//activities
import ActivitiesPage from './pages/activities/ActivitiesPage';
import TimerPage from './pages/activities/TimerPage';
import EditPage from './pages/activities/EditPage';
import StateProvider from './StateContext';

const App: Component = () => {
  invoke<string>('greet', { name: 'World' }).then((res) => console.log(res));

  return (
    <StateProvider>
      <Router>
        <Routes>
          <Route path="/">
            <Route path="/" component={ActivitiesPage} />
            <Route path="/timer" component={TimerPage} />
            <Route path="/edit" component={EditPage} />
          </Route>
          <Route path="/dashboard" component={DashboardPage} />
        </Routes>
      </Router>
    </StateProvider>
  );
};

export default App;
