// src/components/StatusPanel/StatusNextOutage.tsx
import styles from "./StatusPanel.module.scss";

interface StatusNextOutageProps {
  title: string;
  start: string;
  end: string;
  queueName: string;
}

export const StatusNextOutage = ({ title, start, end, queueName }: StatusNextOutageProps) => {
  return (
    <div className={styles.statusPanel__next}>
      <span className={styles.statusPanel__clock}>🕐</span>
      <div>
        <div className={styles.statusPanel__nextTitle}>
          {title}
        </div>
        <div className={styles.statusPanel__nextTime}>
          {start} — {end}
        </div>
        <div className={styles.statusPanel__nextQueue}>{queueName}</div>
      </div>
    </div>
  );
};