// src/components/ThemeSwitcher/ThemeSwitcher.tsx
import styles from "./ThemeSwitcher.module.scss";
import { useTheme } from "../../context/ThemeContext";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = () => {
    toggleTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      className={`${styles.themeSwitcher} ${isDark ? styles.themeSwitcher_dark : ""}`}
      onClick={handleToggle}
      aria-label="Перемкнути тему"
    >
      <span className={styles.themeSwitcher__icon}>☀️</span>
      <span className={styles.themeSwitcher__icon}>🌙</span>
      <span className={styles.themeSwitcher__thumb}></span>
    </button>
  );
};
