// src/components/RegionSelector/RegionSelector.tsx
import styles from "./RegionSelector.module.scss";

export const RegionSelector = () => {
  return (
    <div className={styles.regionSelector}>
      <div className={styles.regionSelector__select}>
        <span className={styles.regionSelector__icon}>📍</span>
        <span>Обрати область</span>
        <span className={styles.regionSelector__arrow}>▼</span>
      </div>
      <div className={styles.regionSelector__select}>
        <span className={styles.regionSelector__icon}>👥</span>
        <span>Обрати чергу</span>
        <span className={styles.regionSelector__arrow}>▼</span>
      </div>
    </div>
  );
};
