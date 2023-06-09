import { useNavigate } from '@solidjs/router';
import { appWindow, currentMonitor, LogicalSize } from '@tauri-apps/api/window';
import { Component, onCleanup, onMount } from 'solid-js';

const DashboardPage: Component = () => {
  const nav = useNavigate();
  onMount(async () => {
    const monitor = await currentMonitor();
    if (monitor) {
      appWindow.setPosition(monitor?.position).then(() => {
        appWindow.setSize(new LogicalSize(1024, 640));
      });
    } else {
      nav('/');
    }
  });

  onCleanup(() => {
    appWindow.setSize(new LogicalSize(340, 600));
  });

  return <div> Dashboard page </div>;
};

export default DashboardPage;
