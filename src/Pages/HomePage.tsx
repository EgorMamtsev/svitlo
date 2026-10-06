import { Info } from "../components/Info/Info";
import { ThemeSwitcher } from "../components/ThemeSwitcher/ThemeSwitcher";
import { ViewSwitcher } from "../components/ViewSwitcher/ViewSwitcher";
import { ScheduleChart } from "../components/ScheduleChart/ScheduleChart"; // Імпорт
import styles from "../styles/HomePage.module.scss";
import { StatusPanel } from "../components/StatusPanel";
import { RegionSelector } from "../components/RegionSelector";

export const HomePage = () => {
  return (
    <div className={styles.home}>
      <div className={styles.home__top}>
        {/* Замість Info тепер RegionSelector */}
        <RegionSelector />

        <div className={styles.home__controls}>
          <ViewSwitcher />
        </div>
      </div>

      <div className={styles.home__schedule}>
        <ScheduleChart />
        <StatusPanel />
      </div>
    </div>
  );
};
