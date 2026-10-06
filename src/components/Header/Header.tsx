// src/components/Header/Header.tsx
import styles from "./Header.module.scss";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        
        {/* Логотип */}
        <div className={styles.header__logo}>
          <span className={styles.header__logoIcon}>⚡</span>
          <span className={styles.header__logoText}>PowerGrid</span>
        </div>

        {/* Текст-опис */}
        <p className={styles.header__description}>
          Актуальний графік погодинних відключень електроенергії для вашої області та черги.
        </p>

        {/* Перемикач теми */}
        <div className={styles.header__right}>
          <ThemeSwitcher />
        </div>

      </div>
    </header>
  );
};