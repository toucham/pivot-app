import { Component } from 'solid-js';
import { formatMs2Time } from '../../utils/timer';
import { Activity, Progress, Time } from '../../model';
import styles from '../../style/activities/ActivityCard.module.css';
import ProgressBar from '../ProgressBar';
import PlayIcon from '../icons/PlayIcon';
import StopIcon from '../icons/StopIcon';

export interface ActivityCardProps {
  activity: Activity;
}

interface InfoSectionProps {
  name: string;
  time: Time;
  progress?: Progress;
}

const IconSection: Component<{ codePoint: number }> = ({ codePoint }) => (
  <div class={styles.cardIconSection}>
    <p>{String.fromCodePoint(codePoint)}</p>
  </div>
);

const InfoSection: Component<InfoSectionProps> = ({ name, progress, time }) => (
  <div class={styles.cardInfoSection}>
    <h4>{name}</h4>
    {progress && (
      <div id="bar">
        <ProgressBar current={30} />
      </div>
    )}
    <p>
      {time.hr}:{time.min}:{time.sec}
    </p>
  </div>
);

const TimerSection: Component = () => (
  <div class={styles.cardTimerSection}>
    <StopIcon />
    <PlayIcon />
  </div>
);

const ActivityCard: Component<ActivityCardProps> = (props) => {
  // const [startTime, setStartTime] = createSignal<number>(Date.now());

  // let interval: NodeJS.Timer;
  // const onClickStartTimer = () => {
  //   setStartTime(Date.now());
  //   interval = setInterval(() => {
  //     const dt = Date.now() - startTime();
  //   }, 1000);
  // };

  // const onClickStopTimer = () => {
  //   clearInterval(interval);
  // };
  return (
    <div id="card" class={styles.card}>
      <IconSection codePoint={props.activity.icon} />
      <InfoSection
        name={props.activity.name}
        time={formatMs2Time(props.activity.timer.currTimer)}
        progress={props.activity.progress}
      />
      <TimerSection />
    </div>
  );
};

export default ActivityCard;
