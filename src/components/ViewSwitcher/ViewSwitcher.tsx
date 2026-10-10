// src/components/ViewSwitcher/ViewSwitcher.tsx
import styles from "./ViewSwitcher.module.scss";
import type { ViewMode } from "../../Pages/HomePage";

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewSwitcher = ({ viewMode, onViewModeChange }: ViewSwitcherProps) => {
  return (
    <div className={styles.viewSwitcher}>
      <div className={styles.viewSwitcher__label}>Відображення графіка</div>
      <div className={styles.viewSwitcher__buttons}>
        <button
          className={`${styles.viewSwitcher__button} ${
            viewMode === "chart" ? styles.viewSwitcher__button_active : ""
          }`}
          onClick={() => onViewModeChange("chart")}
        >
          <span className={styles.icon}>📊</span> Графік
        </button>
        <button
          className={`${styles.viewSwitcher__button} ${
            viewMode === "dial" ? styles.viewSwitcher__button_active : ""
          }`}
          onClick={() => onViewModeChange("dial")}
        >
          <span className={styles.icon}>⏰</span> Циферблат
        </button>
      </div>
    </div>
  );
};