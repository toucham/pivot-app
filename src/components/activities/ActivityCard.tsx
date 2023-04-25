import { Component, createEffect, createSignal, JSX, Show, useContext } from 'solid-js';
import { formatMs2Time } from '../../utils/timer';
import { Activity, Progress, Time, Timer } from '../../model';
import styles from '../../style/activities/ActivityCard.module.css';
import ProgressBar from '../ProgressBar';
import PlayIcon from '../icons/PlayIcon';
import StopIcon from '../icons/StopIcon';
import { Navigate, useNavigate } from '@solidjs/router';
import { StateContext } from '../../StateContext';

export interface ActivityCardProps {
  activity: Activity;
}

interface InfoSectionProps {
  name: string;
  time: Timer;
  progress?: Progress;
}

const IconSection: Component<{ codePoint: number }> = (props) => (
  <div class={styles.cardIconSection}>
    <p>{String.fromCodePoint(props.codePoint)}</p>
  </div>
);

const InfoSection: Component<InfoSectionProps> = (props) => {
  const [time, setTime] = createSignal<Time>({ hr: '00', min: '00', sec: '00' });

  createEffect(() => {
    setTime(formatMs2Time(props.time.time));
  }, props.time);

  return (
    <div class={styles.cardInfoSection}>
      <h4>{props.name}</h4>
      <Show when={props.progress}>
        <div id="bar">
          <ProgressBar
            current={
              props.progress != undefined
                ? Math.ceil((props.time.time / props.progress.time) * 100)
                : 0
            }
            variant={props.progress != undefined ? props.progress.type : 'goal'}
          />
        </div>
      </Show>
      <p>
        {time().hr}:{time().min}:{time().sec}
      </p>
    </div>
  );
};

interface TimerSectionProps {
  activityId: number;
}

const TimerSection: Component<TimerSectionProps> = (props) => {
  const [state, { focusActivity }] = useContext(StateContext);
  const nav = useNavigate();
  createEffect(() => {
    if (state.currId != 0) {
      nav('/timer');
    }
  }, state.currId);

  return (
    <div class={styles.cardTimerSection}>
      <StopIcon />
      <PlayIcon
        onClick={(e) => {
          e.preventDefault();
          focusActivity(props.activityId);
        }}
      />
    </div>
  );
};

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
        time={props.activity.timer}
        progress={props.activity.progress}
      />
      <TimerSection activityId={props.activity.id} />
    </div>
  );
};

export default ActivityCard;
