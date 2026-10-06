// src/components/ViewSwitcher/ViewSwitcher.tsx
import styles from "./ViewSwitcher.module.scss";

export const ViewSwitcher = () => {
  return (
    <div className={styles.viewSwitcher}>
      <div className={styles.viewSwitcher__label}>Відображення графіка</div>
      <div className={styles.viewSwitcher__buttons}>
        <button className={`${styles.viewSwitcher__button} ${styles.viewSwitcher__button_active}`}>
          <span className={styles.icon}>📊</span> Графік
        </button>
        <button className={styles.viewSwitcher__button}>
          <span className={styles.icon}>📋</span> Таблиця
        </button>
      </div>
    </div>
  );
};