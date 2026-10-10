// src/components/StatusPanel/StatusPanel.tsx
import styles from "./StatusPanel.module.scss";
import { StatusCurrent } from "./StatusCurrent";
import { StatusNextOutage } from "./StatusNextOutage";
import { StatusStats } from "./StatusStats";
import {
  isPowerOnNow,
  findCurrentOutage,
  findNextOutage,
  calculateStats,
} from "../../utils/scheduleUtils";
import type { ScheduleData } from "../../api/types";

interface StatusPanelProps {
  schedule: ScheduleData | null;
  queueKey: string | null;
  dayKey: string;
}

export const StatusPanel = ({ schedule, queueKey, dayKey }: StatusPanelProps) => {
  if (!schedule || !queueKey) {
    return (
      <div className={styles.statusPanel}>
        <StatusCurrent powerOn={false} />
      </div>
    );
  }

  const powerOn = isPowerOnNow(schedule, queueKey, dayKey);
  const currentOutage = !powerOn ? findCurrentOutage(schedule, queueKey, dayKey) : null;
  const nextOutage = powerOn ? findNextOutage(schedule, queueKey, dayKey) : null;
  const queueName = schedule.preset.sch_names[queueKey] || queueKey;
  const stats = calculateStats(schedule, queueKey, dayKey);

  const outageToShow = currentOutage || nextOutage;

  let title = "";
  if (currentOutage) {
    title = "Світло повернеться";
  } else if (nextOutage) {
    title = "Наступне відключення";
  }

  return (
    <div className={styles.statusPanel}>
      <StatusCurrent powerOn={powerOn} />

      {outageToShow ? (
        <StatusNextOutage
          title={title}
          start={outageToShow.start}
          end={outageToShow.end}
          queueName={queueName}
        />
      ) : (
        <div className={styles.statusPanel__next}>
          <span className={styles.statusPanel__clock}>✅</span>
          <div>
            <div className={styles.statusPanel__nextTitle}>
              На сьогодні відключень більше не буде
            </div>
            <div className={styles.statusPanel__nextQueue}>{queueName}</div>
          </div>
        </div>
      )}

      <StatusStats onHours={stats.onHours} offHours={stats.offHours} />
    </div>
  );
};