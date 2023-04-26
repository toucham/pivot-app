import {
  Component,
  createEffect,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
  useContext,
} from 'solid-js';
import { formatMs2Time } from '../../utils/timer';
import { Activity, Progress, Time, Timer } from '../../model';
import ProgressBar from '../ProgressBar';
import PlayIcon from '../icons/PlayIcon';
import StopIcon from '../icons/StopIcon';
import { useNavigate } from '@solidjs/router';
import { StateContext } from '../../StateContext';
import styles from '../../style/activities/ActivityCard.module.css';
import PauseIcon from '../icons/PauseIcon';

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
  onClickPlayTimer: () => void;
  onClickPauseTimer: () => void;
}

const TimerSection: Component<TimerSectionProps> = (props) => {
  const [isPause, setIsPause] = createSignal(false);
  const [state, { focusActivity, unfocusActivity }] = useContext(StateContext);
  const nav = useNavigate();

  const onClickPause = () => {
    setIsPause(!isPause());
    props.onClickPauseTimer();
  };

  const onClickPlayAfterPause = () => {
    setIsPause(!isPause());
    props.onClickPlayTimer();
  };

  const onClickStop = () => {
    unfocusActivity();
    nav('/');
  };

  const onClickPlay = () => {
    focusActivity(props.activityId);
    nav('/timer');
  };

  return (
    <div class={styles.cardTimerSection}>
      <Switch fallback={<div>404 Not Found</div>}>
        <Match when={state.currId == props.activityId}>
          <StopIcon onClick={onClickStop} />
          <Switch>
            <Match when={!isPause()}>
              <PauseIcon onClick={onClickPause} />
            </Match>
            <Match when={isPause()}>
              <PlayIcon onClick={onClickPlayAfterPause} />
            </Match>
          </Switch>
        </Match>
        <Match when={state.currId != props.activityId}>
          <PlayIcon onClick={onClickPlay} />
        </Match>
      </Switch>
    </div>
  );
};

const ActivityCard: Component<ActivityCardProps> = (props) => {
  const [state, { addCurrTime }] = useContext(StateContext);
  const [startTime, setStartTime] = createSignal<number>(Date.now());

  let interval: number;
  const onClickPlayTimer = () => {
    setStartTime(Date.now());
    interval = setInterval(() => {
      const timeNow = Date.now();
      const dt = timeNow - startTime();
      addCurrTime(dt);
      setStartTime(timeNow);
    }, 1000);
  };

  const onClickPauseTimer = () => {
    clearInterval(interval);
  };

  onMount(() => {
    if (state.currId == props.activity.id) {
      const refs = document.querySelectorAll('main *');
      for (const r of refs) {
        r.setAttribute('data-tauri-drag-region', '');
      }
      onClickPlayTimer();
    }
  });

  onCleanup(() => {
    clearInterval(interval);
  });

  return (
    <div id="card" class={styles.card}>
      <IconSection codePoint={props.activity.icon} />
      <InfoSection
        name={props.activity.name}
        time={props.activity.timer}
        progress={props.activity.progress}
      />
      <TimerSection
        activityId={props.activity.id}
        onClickPlayTimer={onClickPlayTimer}
        onClickPauseTimer={onClickPauseTimer}
      />
    </div>
  );
};

export default ActivityCard;
