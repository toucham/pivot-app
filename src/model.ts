export interface Group {
  tag: string;
  color: string;
}

export interface Progress {
  type: 'goal' | 'limit';
  complete: number;
}

export interface Time {
  hr: string;
  min: string;
  sec: string;
}

export interface Timer {
  ongoing: boolean;
  currTimer: number;
  start?: number;
  end?: number;
}

export interface Activity {
  icon: number;
  name: string;
  timer: Timer;
  description?: string;
  group?: Group;
  progress?: Progress;
}
