import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import App from './App';
import StateProvider from './StateContext';
import './style/index.css';

render(
  () => (
    <Router>
      <StateProvider>
        <App />
      </StateProvider>
    </Router>
  ),
  document.getElementById('root') as HTMLElement,
);
