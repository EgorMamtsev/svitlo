// src/components/ScheduleChart/ScheduleChart.tsx
import { useState } from "react";
import styles from "./ScheduleChart.module.scss";
import type { ScheduleData } from "../../api/types";

const isDark = (status: string): boolean => {
  return status === "no" || status === "first" || status === "second";
};

const getHalfColor = (
  status: string,
  half: "first" | "second",
  prevStatus: string | null,
  nextStatus: string | null
): string => {
  if (status === "first") {
    return half === "first" ? "red" : "green";
  }

  if (status === "second") {
    return half === "first" ? "green" : "red";
  }

  if (status === "mfirst") {
    if (isDark(prevStatus || "")) {
      return half === "first" ? "red" : "green";
    }
    return half === "first" ? "green" : "red";
  }

  if (status === "msecond") {
    if (isDark(nextStatus || "")) {
      return half === "first" ? "green" : "red";
    }
    return half === "first" ? "red" : "green";
  }

  if (status === "maybe") {
    return "red";
  }

  if (status === "yes") return "green";
  if (status === "no") return "red";

  return "green";
};

const colorToClass = (color: string): string => {
  switch (color) {
    case "red":
      return styles.chart__cell_red;
    default:
      return styles.chart__cell_green;
  }
};

interface ScheduleChartProps {
  queueKey: string;
  schedule: ScheduleData;
}

type DayTab = "today" | "tomorrow";

// Форматуємо дату українською
const formatDate = (date: Date): string => {
  const months = [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

// Отримуємо дату для вкладки
const getDateForTab = (tab: DayTab): string => {
  const now = new Date();
  const kyivTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" })
  );

  if (tab === "tomorrow") {
    kyivTime.setDate(kyivTime.getDate() + 1);
  }

  return formatDate(kyivTime);
};

export const ScheduleChart = ({ queueKey, schedule }: ScheduleChartProps) => {
  const [activeTab, setActiveTab] = useState<DayTab>("today");

  const dayKey = activeTab === "today" ? "1" : "2";
  const dayStatus = schedule.preset.day_status?.[dayKey];
  const dayName = schedule.preset.days[dayKey];
  const dateStr = getDateForTab(activeTab);

  const queueData = schedule.preset.data[queueKey]?.[dayKey];

  const allHourKeys = Object.keys(schedule.preset.time_zone);
  const totalSegments = allHourKeys.length;
  const segmentsPerRow = totalSegments / 2;

  const firstRowHours = allHourKeys.slice(0, segmentsPerRow);
  const secondRowHours = allHourKeys.slice(segmentsPerRow);

  const getRowLabels = (hours: string[]) => {
    const labels: { time: string; isHalf: boolean }[] = [];

    hours.forEach((key, index) => {
      const [_, start, end] = schedule.preset.time_zone[key];
      const startHour = start.split(":")[0];

      if (index === 0) {
        labels.push({ time: start, isHalf: false });
      }

      labels.push({ time: `${startHour}:30`, isHalf: true });

      if (index === hours.length - 1) {
        labels.push({ time: end, isHalf: false });
      }
    });

    return labels;
  };

  const firstRowLabels = getRowLabels(firstRowHours);
  const secondRowLabels = getRowLabels(secondRowHours);

  const queueName = schedule.preset.sch_names[queueKey] || queueKey;

  const renderRow = (hours: string[], labels: { time: string; isHalf: boolean }[]) => (
    <div className={styles.chart__rowWrapper}>
      <div className={styles.chart__timeLabels}>
        {labels.map((label, index) => (
          <span
            key={index}
            className={`${styles.chart__timeLabel} ${
              label.isHalf ? styles.chart__timeLabel_half : ""
            }`}
            style={{ left: `${(index / (labels.length - 1)) * 100}%` }}
          >
            {label.time}
          </span>
        ))}
      </div>

      <div
        className={styles.chart__row}
        style={{ gridTemplateColumns: `repeat(${hours.length}, 1fr)` }}
      >
        {hours.map((hourKey, index) => {
          const status = (queueData?.[hourKey] || "no") as string;
          const prevHourKey = hours[index - 1];
          const nextHourKey = hours[index + 1];
          const prevStatus = prevHourKey ? (queueData?.[prevHourKey] as string) : null;
          const nextStatus = nextHourKey ? (queueData?.[nextHourKey] as string) : null;

          const firstHalfColor = getHalfColor(status, "first", prevStatus, nextStatus);
          const secondHalfColor = getHalfColor(status, "second", prevStatus, nextStatus);
          const timeRange = schedule.preset.time_zone[hourKey][0];

          return (
            <div key={hourKey} className={styles.chart__hourCell}>
              <div
                className={`${styles.chart__halfCell} ${colorToClass(firstHalfColor)}`}
                title={`${timeRange} (перші 30 хв) — ${schedule.preset.time_type[status] || status}`}
              ></div>
              <div
                className={`${styles.chart__halfCell} ${colorToClass(secondHalfColor)}`}
                title={`${timeRange} (другі 30 хв) — ${schedule.preset.time_type[status] || status}`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={styles.chart}>
      <div className={styles.chart__header}>
        <div className={styles.chart__dateWrapper}>
          <div className={styles.chart__date}>
            <span className={styles.chart__icon}>📅</span>
            {dayName}, {dateStr} — {queueName}
          </div>
          <div className={styles.chart__updated}>
            <span className={styles.chart__updatedDot}></span>
            Оновлено: {schedule.fact.update}
          </div>
        </div>

        <div className={styles.chart__tabs}>
          <button
            className={`${styles.chart__tab} ${
              activeTab === "today" ? styles.chart__tab_active : ""
            }`}
            onClick={() => setActiveTab("today")}
          >
            Сьогодні
          </button>
          <button
            className={`${styles.chart__tab} ${
              activeTab === "tomorrow" ? styles.chart__tab_active : ""
            }`}
            onClick={() => setActiveTab("tomorrow")}
          >
            Завтра
          </button>
        </div>
      </div>

      {dayStatus === "WaitingForSchedule" ? (
        <div className={styles.chart__placeholder}>
          Графік на завтра ще не опубліковано
        </div>
      ) : (
        <div className={styles.chart__grid}>
          {renderRow(firstRowHours, firstRowLabels)}
          {renderRow(secondRowHours, secondRowLabels)}
        </div>
      )}

      <div className={styles.chart__legend}>
        <div className={styles.chart__legendItem}>
          <span className={`${styles.chart__legendDot} ${styles.chart__cell_green}`}></span>
          Світло є
        </div>
        <div className={styles.chart__legendItem}>
          <span className={`${styles.chart__legendDot} ${styles.chart__cell_red}`}></span>
          Світла немає
        </div>
      </div>
    </div>
  );
};