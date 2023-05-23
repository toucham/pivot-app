import {
  Component,
  createMemo,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
  useContext,
} from 'solid-js';
import { formatMs2Time } from '../../utils/timer';
import { Activity, ActivityTimerJson, Progress, Timer } from '../../model';
import ProgressBar from '../ProgressBar';
import PlayIcon from '../icons/PlayIcon';
import StopIcon from '../icons/StopIcon';
import { useNavigate } from '@solidjs/router';
import { StateContext } from '../../StateContext';
import styles from '../../style/activities/ActivityCard.module.css';
import PauseIcon from '../icons/PauseIcon';
import { invoke } from '@tauri-apps/api';

export interface ActivityCardProps {
  activity: Activity;
}

interface InfoSectionProps {
  name: string;
  timer: Timer;
  progress?: Progress;
}

const IconSection: Component<{ codePoint: number }> = (props) => (
  <div class={styles.cardIconSection}>
    <p>{String.fromCodePoint(props.codePoint)}</p>
  </div>
);

const InfoSection: Component<InfoSectionProps> = (props) => {
  const formatTime = createMemo(() => {
    const f = formatMs2Time(props.timer.time_ms);
    return f;
  }, props.timer.time_ms);

  return (
    <div class={styles.cardInfoSection}>
      <h4>{props.name}</h4>
      <Show when={props.progress}>
        <div id="bar">
          <ProgressBar
            current={
              props.progress != undefined
                ? Math.ceil((props.timer.time_ms / props.progress.time_ms) * 100)
                : 0
            }
            variant={props.progress?.t}
          />
        </div>
      </Show>
      <p>
        {formatTime().hr}:{formatTime().min}:{formatTime().sec}
      </p>
    </div>
  );
};

interface TimerSectionProps {
  activityId: number;
  timeMs: number;
  startTime: Date;
  onClickPlayTimer: () => void;
  onClickPauseTimer: () => void;
}

const TimerSection: Component<TimerSectionProps> = (props) => {
  const [isPause, setIsPause] = createSignal(false);
  const [state, { focusActivity, unfocusActivity }] = useContext(StateContext);
  const nav = useNavigate();

  const invokeUpdateActivityTime = async () => {
    invoke('update_activity_time', { id: state.currId, timeMs: props.timeMs }).catch((e) =>
      console.error(e),
    );
  };

  const invokeCreateTimer = async () => {
    const endDate = new Date();
    // only save if it is more than a minute
    if (endDate.getTime() - props.startTime.getTime() >= 6000) {
      const act: ActivityTimerJson = {
        id: state.currId,
        timer: {
          start_date: props.startTime.toISOString(),
          end_date: endDate.toISOString(),
        },
      };
      invoke('create_timer', { act }).catch((e) => console.error(e));
    }
  };
  const onClickPause = async () => {
    invokeCreateTimer();
    setIsPause(!isPause());
    props.onClickPauseTimer();
  };

  const onClickPlayAfterPause = () => {
    setIsPause(!isPause());
    props.onClickPlayTimer();
  };

  const onClickStop = async () => {
    if (!isPause()) {
      invokeCreateTimer();
    }
    invokeUpdateActivityTime();
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
      <IconSection codePoint={props.activity.icon ?? 0} />
      <InfoSection
        name={props.activity.name}
        timer={props.activity.timer}
        progress={props.activity.progress}
      />
      <TimerSection
        timeMs={props.activity.timer.time_ms}
        startTime={new Date(startTime())}
        activityId={props.activity.id}
        onClickPlayTimer={onClickPlayTimer}
        onClickPauseTimer={onClickPauseTimer}
      />
    </div>
  );
};

export default ActivityCard;
