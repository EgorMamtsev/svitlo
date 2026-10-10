// src/Pages/HomePage.tsx
import { useEffect, useState } from "react";
import { RegionSelector } from "../components/RegionSelector/RegionSelector";
import { AddressSearch } from "../components/AddressSearch/AddressSearch";
import { ViewSwitcher } from "../components/ViewSwitcher/ViewSwitcher";
import { ScheduleChart } from "../components/ScheduleChart/ScheduleChart";
import { ScheduleDial } from "../components/ScheduleDial/ScheduleDial";
import { StatusPanel } from "../components/StatusPanel/StatusPanel";
import { fetchPlannedOutages } from "../api/yasno/yasnoApi";
import { fetchOEData } from "../api/oe/oeApi";
import { adaptYasnoData } from "../api/yasno/yasnoAdapter";
import { adaptOEByKey } from "../api/oe/oeFactory";
import { REGIONS } from "../api/regions";
import type { ScheduleData } from "../api/types";
import styles from "../styles/HomePage.module.scss";

const STORAGE_KEYS = {
  region: "powergrid_selected_region",
  mainQueue: "powergrid_selected_main_queue",
  subQueue: "powergrid_selected_sub_queue",
  viewMode: "powergrid_view_mode",
  address: "powergrid_address",
};

export type ViewMode = "chart" | "dial";

export const HomePage = () => {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.viewMode);
    return (saved as ViewMode) || "chart";
  });

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.region),
  );
  const [selectedMainQueue, setSelectedMainQueue] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEYS.mainQueue),
  );
  const [selectedSubQueue, setSelectedSubQueue] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.subQueue),
  );
  const [selectedAddress, setSelectedAddress] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.address),
  );

  const isKyiv = selectedRegionId === "yasno-25";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.viewMode, viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (selectedAddress)
      localStorage.setItem(STORAGE_KEYS.address, selectedAddress);
    else localStorage.removeItem(STORAGE_KEYS.address);
  }, [selectedAddress]);

  useEffect(() => {
    if (!selectedRegionId) {
      setSchedule(null);
      setIsEmergency(false);
      setEmergencyReason(null);
      return;
    }

    const region = REGIONS.find((r) => r.id === selectedRegionId);
    if (!region) return;

    setIsLoading(true);
    setError(null);

    if (region.source === "yasno" && region.regionId && region.dsoId) {
      fetchPlannedOutages(region.regionId, region.dsoId).then((data) => {
        if (data) {
          const adapted = adaptYasnoData(
            data,
            region.regionId!,
            region.dsoId!,
            region.name,
            "",
          );
          setSchedule(adapted.schedule);
          setIsEmergency(adapted.isEmergency);
          setEmergencyReason(adapted.emergencyReason);
        } else {
          setError("Не вдалося завантажити дані.");
        }
        setIsLoading(false);
      });
    } else if (region.source === "oe" && region.fileName) {
      fetchOEData(region.fileName).then((data) => {
        if (data) {
          const adapted = adaptOEByKey(
            region.adapterKey || "poltava",
            data,
            region.name,
          );
          setSchedule(adapted.schedule);
          setIsEmergency(adapted.isEmergency);
          setEmergencyReason(adapted.emergencyReason);
        } else {
          setError("Не вдалося завантажити дані.");
        }
        setIsLoading(false);
      });
    }
  }, [selectedRegionId]);

  useEffect(() => {
    if (selectedRegionId)
      localStorage.setItem(STORAGE_KEYS.region, selectedRegionId);
    else localStorage.removeItem(STORAGE_KEYS.region);
  }, [selectedRegionId]);

  useEffect(() => {
    if (selectedMainQueue)
      localStorage.setItem(STORAGE_KEYS.mainQueue, selectedMainQueue);
    else localStorage.removeItem(STORAGE_KEYS.mainQueue);
  }, [selectedMainQueue]);

  useEffect(() => {
    if (selectedSubQueue)
      localStorage.setItem(STORAGE_KEYS.subQueue, selectedSubQueue);
    else localStorage.removeItem(STORAGE_KEYS.subQueue);
  }, [selectedSubQueue]);

  const allQueueKeys =
    schedule && schedule.preset && schedule.preset.data
      ? Object.keys(schedule.preset.data)
      : [];

  const mainQueuesMap = new Map<string, string[]>();
  allQueueKeys.forEach((key) => {
    const parts = key.split(".");
    const mainQueue = parts[0];
    if (!mainQueuesMap.has(mainQueue)) {
      mainQueuesMap.set(mainQueue, []);
    }
    mainQueuesMap.get(mainQueue)!.push(key);
  });

  const mainQueues = Array.from(mainQueuesMap.keys()).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ""), 10);
    const numB = parseInt(b.replace(/\D/g, ""), 10);
    return numA - numB;
  });

  const subQueues = selectedMainQueue
    ? mainQueuesMap.get(selectedMainQueue) || []
    : [];

  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedMainQueue(null);
    setSelectedSubQueue(null);
    setSelectedAddress(null);
  };

  const handleMainQueueChange = (queue: string) => {
    setSelectedMainQueue(queue);
    setSelectedSubQueue(null);
  };

  const handleSubQueueChange = (subQueue: string) => {
    setSelectedSubQueue(subQueue);
  };

  const handleGroupFound = (groupKey: string, addressLabel: string) => {
    const [mainQueue, subQueue] = groupKey.split(".");
    setSelectedMainQueue(mainQueue);
    setSelectedSubQueue(groupKey);
    setSelectedAddress(addressLabel);
  };

  const hasQueues = mainQueues.length > 0;
  const getCurrentDayKey = (): string => "1";

  const canShowChart = isKyiv
    ? !!selectedSubQueue
    : !!selectedMainQueue && !!selectedSubQueue;

  const centerLabel = isKyiv && selectedAddress ? selectedAddress : undefined;

  return (
    <div className={styles.home}>
      <div className={styles.home__top}>
        {isKyiv ? (
          <div className={styles.home__addressSearch}>
            <RegionSelector
              regions={REGIONS}
              selectedRegionId={selectedRegionId}
              mainQueues={mainQueues}
              subQueues={subQueues}
              selectedMainQueue={selectedMainQueue}
              selectedSubQueue={selectedSubQueue}
              onRegionChange={handleRegionChange}
              onMainQueueChange={handleMainQueueChange}
              onSubQueueChange={handleSubQueueChange}
              hideQueues={true}
            />
            <AddressSearch
              regionId={25}
              dsoId={902}
              onGroupFound={handleGroupFound}
            />
          </div>
        ) : (
          <RegionSelector
            regions={REGIONS}
            selectedRegionId={selectedRegionId}
            mainQueues={mainQueues}
            subQueues={subQueues}
            selectedMainQueue={selectedMainQueue}
            selectedSubQueue={selectedSubQueue}
            onRegionChange={handleRegionChange}
            onMainQueueChange={handleMainQueueChange}
            onSubQueueChange={handleSubQueueChange}
          />
        )}

        <div className={styles.home__controls}>
          <ViewSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      <div className={styles.home__schedule}>
        {isLoading ? (
          <div className={styles.home__placeholder}>Завантаження даних...</div>
        ) : error ? (
          <div className={styles.home__placeholder}>Помилка: {error}</div>
        ) : !selectedRegionId ? (
          <div className={styles.home__placeholder}>
            Оберіть область, щоб почати
          </div>
        ) : !hasQueues ? (
          <div className={styles.home__placeholder}>
            Для цієї області дані про черги недоступні.
          </div>
        ) : !canShowChart ? (
          <div className={styles.home__placeholder}>
            {isKyiv ? "Введіть свою адресу" : "Оберіть чергу та підчергу"}
          </div>
        ) : schedule && selectedSubQueue ? (
          <>
            {isEmergency && emergencyReason && (
              <div className={styles.home__emergencyBanner}>
                <span className={styles.home__emergencyIcon}>⚠️</span>
                <span>{emergencyReason}</span>
              </div>
            )}

            {viewMode === "chart" ? (
              <ScheduleChart queueKey={selectedSubQueue} schedule={schedule} />
            ) : (
              <ScheduleDial
                queueKey={selectedSubQueue}
                schedule={schedule}
                centerLabel={centerLabel}
              />
            )}
          </>
        ) : null}

        {canShowChart && (
          <StatusPanel
            schedule={schedule}
            queueKey={selectedSubQueue}
            dayKey={getCurrentDayKey()}
          />
        )}
      </div>
    </div>
  );
};
