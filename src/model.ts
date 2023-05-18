export interface Group {
  tag: string;
  color: string;
}

export interface Progress {
  t: 'Goal' | 'Limit'; // switch to match rust typing
  time_ms: number;
}

export interface Time {
  hr: string;
  min: string;
  sec: string;
}

export interface Timer {
  time_ms: number;
  start?: number;
  end?: number;
}

export interface Activity {
  id: number;
  name: string;
  icon: number;
  timer: Timer;
  rank: number;
  desc?: string;
  group?: Group;
  progress?: Progress;
}

export interface ActivityJson {
  id: number;
  name: string;
  icon: number;
  rank: number;
  time_ms: number;
  desc?: string;
  progress?: Progress;
}
