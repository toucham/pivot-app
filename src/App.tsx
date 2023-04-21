import type { Component } from 'solid-js';
import { invoke } from '@tauri-apps/api';

const App: Component = () => {
  invoke<string>('greet', { name: 'World' }).then((res) => console.log(res));

  return <div>Hi finally yay</div>;
};

export default App;
