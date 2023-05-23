import { Time } from '../model';

export const formatMs2Time = (ms: number): Time => {
  let time: Time = {
    hr: '00',
    min: '00',
    sec: '00',
  };
  if (ms > 0 && ms <= 86400000) {
    // hr in 3600000
    // min in 60000
    // secs in 1000
    const second = Math.floor((ms / 1000) % 60),
      minute = Math.floor((ms / (1000 * 60)) % 60),
      hour = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const sec = second < 10 ? '0' + second : `${second}`,
      min = minute < 10 ? '0' + minute : `${minute}`,
      hr = hour < 10 ? '0' + hour : `${hour}`;

    time = {
      hr,
      min,
      sec,
    };
  }
  return time;
};

export const formatTime2Ms = (time: { hr: number; min: number; sec: number }): number => {
  return 3600000 * time.hr + 60000 * time.min + 1000 * time.sec;
};
