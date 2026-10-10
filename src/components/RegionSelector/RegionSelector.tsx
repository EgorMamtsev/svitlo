// src/components/RegionSelector/RegionSelector.tsx
import styles from "./RegionSelector.module.scss";

interface RegionOption {
  id: string;
  name: string;
  source: string;
}

interface RegionSelectorProps {
  regions: RegionOption[];
  selectedRegionId: string | null;
  mainQueues: string[];
  subQueues: string[];
  selectedMainQueue: string | null;
  selectedSubQueue: string | null;
  onRegionChange: (regionId: string) => void;
  onMainQueueChange: (queue: string) => void;
  onSubQueueChange: (subQueue: string) => void;
}

export const RegionSelector = ({
  regions,
  selectedRegionId,
  mainQueues,
  subQueues,
  selectedMainQueue,
  selectedSubQueue,
  onRegionChange,
  onMainQueueChange,
  onSubQueueChange,
}: RegionSelectorProps) => {
  return (
    <div className={styles.regionSelector}>
      {/* Селект області */}
      <div className={styles.regionSelector__select}>
        <span className={styles.regionSelector__icon}>📍</span>
        <select
          value={selectedRegionId || ""}
          onChange={(e) => onRegionChange(e.target.value)}
          className={styles.regionSelector__nativeSelect}
        >
          <option value="" disabled>
            Обрати область
          </option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        <span className={styles.regionSelector__arrow}>▼</span>
      </div>

      {/* Селект черги */}
      <div
        className={`${styles.regionSelector__select} ${
          !selectedRegionId ? styles.regionSelector__select_disabled : ""
        }`}
      >
        <span className={styles.regionSelector__icon}>👥</span>
        <select
          value={selectedMainQueue || ""}
          onChange={(e) => onMainQueueChange(e.target.value)}
          disabled={!selectedRegionId}
          className={styles.regionSelector__nativeSelect}
        >
          <option value="" disabled>
            Обрати чергу
          </option>
          {mainQueues.map((queue) => (
            <option key={queue} value={queue}>
              Черга {queue}
            </option>
          ))}
        </select>
        <span className={styles.regionSelector__arrow}>▼</span>
      </div>

      {/* Селект підчерги */}
      <div
        className={`${styles.regionSelector__select} ${
          !selectedMainQueue ? styles.regionSelector__select_disabled : ""
        }`}
      >
        <span className={styles.regionSelector__icon}>👥</span>
        <select
          value={selectedSubQueue || ""}
          onChange={(e) => onSubQueueChange(e.target.value)}
          disabled={!selectedMainQueue}
          className={styles.regionSelector__nativeSelect}
        >
          <option value="" disabled>
            Обрати підчергу
          </option>
          {subQueues.map((subQueue) => (
            <option key={subQueue} value={subQueue}>
              Черга {subQueue}
            </option>
          ))}
        </select>
        <span className={styles.regionSelector__arrow}>▼</span>
      </div>
    </div>
  );
};