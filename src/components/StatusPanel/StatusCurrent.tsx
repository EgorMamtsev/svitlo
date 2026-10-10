// src/components/StatusPanel/StatusCurrent.tsx
import styles from "./StatusPanel.module.scss";

interface StatusCurrentProps {
  powerOn: boolean;
}

export const StatusCurrent = ({ powerOn }: StatusCurrentProps) => {
  return (
    <div className={styles.statusPanel__current}>
      <div
        className={`${styles.statusPanel__iconWrapper} ${
          !powerOn ? styles.statusPanel__iconWrapper_off : ""
        }`}
      >
        <span className={styles.statusPanel__icon}>⚡</span>
      </div>
      <div className={styles.statusPanel__text}>
        <div className={styles.statusPanel__title}>
          {powerOn ? "Зараз є світло" : "Зараз немає світла"}
        </div>
        <div className={styles.statusPanel__subtitle}>
          {powerOn
            ? "Електропостачання подається"
            : "Електропостачання відсутнє"}
        </div>
      </div>
    </div>
  );
};