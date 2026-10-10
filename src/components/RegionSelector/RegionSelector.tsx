// src/components/RegionSelector/RegionSelector.tsx
import { useState, useRef, useEffect } from "react";
import styles from "./RegionSelector.module.scss";
import type { RegionOption } from "../../api/regions";

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
  hideQueues?: boolean; // ← НОВИЙ ПРОП
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
  hideQueues = false, // ← ЗА ЗАМОВЧУВАННЯМ FALSE
}: RegionSelectorProps) => {
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isSubQueueOpen, setIsSubQueueOpen] = useState(false);

  const regionRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<HTMLDivElement>(null);
  const subQueueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) {
        setIsRegionOpen(false);
      }
      if (queueRef.current && !queueRef.current.contains(event.target as Node)) {
        setIsQueueOpen(false);
      }
      if (subQueueRef.current && !subQueueRef.current.contains(event.target as Node)) {
        setIsSubQueueOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);

  return (
    <div className={styles.regionSelector}>
      {/* Селект області */}
      <div ref={regionRef} className={styles.regionSelector__wrapper}>
        <div
          className={`${styles.regionSelector__select} ${
            isRegionOpen ? styles.regionSelector__select_open : ""
          }`}
          onClick={() => setIsRegionOpen(!isRegionOpen)}
        >
          <span className={styles.regionSelector__icon}>📍</span>
          <span className={styles.regionSelector__value}>
            {selectedRegion?.name || "Обрати область"}
          </span>
          <span
            className={`${styles.regionSelector__arrow} ${
              isRegionOpen ? styles.regionSelector__arrow_open : ""
            }`}
          >
            ▼
          </span>
        </div>

        {isRegionOpen && (
          <div className={styles.regionSelector__dropdown}>
            {regions.map((region) => (
              <div
                key={region.id}
                className={`${styles.regionSelector__option} ${
                  region.id === selectedRegionId ? styles.regionSelector__option_active : ""
                }`}
                onClick={() => {
                  onRegionChange(region.id);
                  setIsRegionOpen(false);
                }}
              >
                {region.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Селект черги — ТІЛЬКИ ЯКЩО hideQueues = false */}
      {!hideQueues && (
        <div
          ref={queueRef}
          className={`${styles.regionSelector__wrapper} ${
            !selectedRegionId ? styles.regionSelector__wrapper_disabled : ""
          }`}
        >
          <div
            className={`${styles.regionSelector__select} ${
              isQueueOpen ? styles.regionSelector__select_open : ""
            }`}
            onClick={() => selectedRegionId && setIsQueueOpen(!isQueueOpen)}
          >
            <span className={styles.regionSelector__icon}>👥</span>
            <span className={styles.regionSelector__value}>
              {selectedMainQueue ? `Черга ${selectedMainQueue}` : "Обрати чергу"}
            </span>
            <span
              className={`${styles.regionSelector__arrow} ${
                isQueueOpen ? styles.regionSelector__arrow_open : ""
              }`}
            >
              ▼
            </span>
          </div>

          {isQueueOpen && mainQueues.length > 0 && (
            <div className={styles.regionSelector__dropdown}>
              {mainQueues.map((queue) => (
                <div
                  key={queue}
                  className={`${styles.regionSelector__option} ${
                    queue === selectedMainQueue ? styles.regionSelector__option_active : ""
                  }`}
                  onClick={() => {
                    onMainQueueChange(queue);
                    setIsQueueOpen(false);
                  }}
                >
                  Черга {queue}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Селект підчерги — ТІЛЬКИ ЯКЩО hideQueues = false */}
      {!hideQueues && (
        <div
          ref={subQueueRef}
          className={`${styles.regionSelector__wrapper} ${
            !selectedMainQueue ? styles.regionSelector__wrapper_disabled : ""
          }`}
        >
          <div
            className={`${styles.regionSelector__select} ${
              isSubQueueOpen ? styles.regionSelector__select_open : ""
            }`}
            onClick={() => selectedMainQueue && setIsSubQueueOpen(!isSubQueueOpen)}
          >
            <span className={styles.regionSelector__icon}>👥</span>
            <span className={styles.regionSelector__value}>
              {selectedSubQueue ? `Черга ${selectedSubQueue}` : "Обрати підчергу"}
            </span>
            <span
              className={`${styles.regionSelector__arrow} ${
                isSubQueueOpen ? styles.regionSelector__arrow_open : ""
              }`}
            >
              ▼
            </span>
          </div>

          {isSubQueueOpen && subQueues.length > 0 && (
            <div className={styles.regionSelector__dropdown}>
              {subQueues.map((subQueue) => (
                <div
                  key={subQueue}
                  className={`${styles.regionSelector__option} ${
                    subQueue === selectedSubQueue ? styles.regionSelector__option_active : ""
                  }`}
                  onClick={() => {
                    onSubQueueChange(subQueue);
                    setIsSubQueueOpen(false);
                  }}
                >
                  Черга {subQueue}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};