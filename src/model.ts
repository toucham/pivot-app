export interface Group {
  tag: string;
  color: string;
}

export interface Progress {
  type: 'goal' | 'limit';
  time: number;
}

export interface Time {
  hr: string;
  min: string;
  sec: string;
}

export interface Timer {
  ongoing: boolean;
  time: number;
  start?: number;
  end?: number;
}

export interface Activity {
  id: number;
  icon: number;
  name: string;
  timer: Timer;
  description?: string;
  group?: Group;
  progress?: Progress;
}
