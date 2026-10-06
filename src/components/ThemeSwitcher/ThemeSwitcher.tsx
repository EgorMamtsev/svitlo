// src/components/ThemeSwitcher/ThemeSwitcher.tsx
import styles from "./ThemeSwitcher.module.scss";

export const ThemeSwitcher = () => {
  return (
    <div className={styles.themeSwitcher}>
      <div className={styles.themeSwitcher__buttons}>
        <button
          className={`${styles.themeSwitcher__button} ${styles.themeSwitcher__button_active}`}
        >
          <span className={styles.icon}>☀️</span>
        </button>
        <button className={styles.themeSwitcher__button}>
          <span className={styles.icon}>🌙</span>
        </button>
      </div>
    </div>
  );
};
