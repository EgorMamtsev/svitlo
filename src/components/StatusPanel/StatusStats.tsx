// src/components/StatusPanel/StatusStats.tsx
import styles from "./StatusPanel.module.scss";

interface StatusStatsProps {
  onHours: number;
  offHours: number;
}

export const StatusStats = ({ onHours, offHours }: StatusStatsProps) => {
  return (
    <div className={styles.statusPanel__stats}>
      <div className={styles.statusPanel__stat}>
        <span className={`${styles.statusPanel__statDot} ${styles.statusPanel__statDot_on}`}></span>
        <div>
          <div className={styles.statusPanel__statValue}>{onHours} год</div>
          <div className={styles.statusPanel__statLabel}>Зі світлом</div>
        </div>
      </div>

      <div className={styles.statusPanel__stat}>
        <span className={`${styles.statusPanel__statDot} ${styles.statusPanel__statDot_off}`}></span>
        <div>
          <div className={styles.statusPanel__statValue}>{offHours} год</div>
          <div className={styles.statusPanel__statLabel}>Без світла</div>
        </div>
      </div>
    </div>
  );
};