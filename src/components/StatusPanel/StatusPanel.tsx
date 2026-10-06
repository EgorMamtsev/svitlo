// src/components/StatusPanel/StatusPanel.tsx
import styles from "./StatusPanel.module.scss";
import scheduleData from "../../../api/cherhi.json";

export const StatusPanel = () => {
  const { currentStatus } = scheduleData;

  return (
    <div className={styles.statusPanel}>
      {/* Ліва частина: Зараз є світло */}
      <div className={styles.statusPanel__current}>
        <div className={styles.statusPanel__iconWrapper}>
          <span className={styles.statusPanel__icon}>⚡</span>
        </div>
        <div className={styles.statusPanel__text}>
          <div className={styles.statusPanel__title}>
            {currentStatus.isPowerOn ? "Зараз є світло" : "Зараз немає світла"}
          </div>
          <div className={styles.statusPanel__subtitle}>
            {currentStatus.isPowerOn
              ? "Електропостачання подається"
              : "Електропостачання відсутнє"}
          </div>
        </div>
      </div>

      {/* Центральна частина: Легенда */}
      <div className={styles.statusPanel__legend}>
        <div className={styles.statusPanel__legendItem}>
          <span
            className={`${styles.statusPanel__dot} ${styles.statusPanel__dot_green}`}
          ></span>
          <div>
            <div className={styles.statusPanel__legendTitle}>Є світло</div>
            <div className={styles.statusPanel__legendSubtitle}>
              Електроенергія є
            </div>
          </div>
        </div>
        <div className={styles.statusPanel__legendItem}>
          <span
            className={`${styles.statusPanel__dot} ${styles.statusPanel__dot_red}`}
          ></span>
          <div>
            <div className={styles.statusPanel__legendTitle}>Немає світла</div>
            <div className={styles.statusPanel__legendSubtitle}>
              Відключення
            </div>
          </div>
        </div>
      </div>

      {/* Права частина: Наступне відключення */}
      <div className={styles.statusPanel__next}>
        <span className={styles.statusPanel__clock}>🕐</span>
        <div>
          <div className={styles.statusPanel__nextTitle}>
            Наступне відключення
          </div>
          <div className={styles.statusPanel__nextTime}>
            {currentStatus.nextOutage.start} — {currentStatus.nextOutage.end}
          </div>
          <div className={styles.statusPanel__nextQueue}>
            {scheduleData.queue}
          </div>
        </div>
      </div>
    </div>
  );
};
