// src/components/ScheduleDial/ScheduleDial.tsx
import { useState } from "react";
import styles from "./ScheduleDial.module.scss";
import type { ScheduleData } from "../../api/types";
import { formatQueueName } from "../../utils/queueUtils";

type DayTab = "today" | "tomorrow";

const isPowerOff = (status: string): boolean => {
  return status === "no" || status === "first" || status === "second";
};

const getHalfColor = (
  status: string,
  half: "first" | "second",
  prevStatus: string | null,
  nextStatus: string | null,
): string => {
  if (status === "first") return half === "first" ? "red" : "green";
  if (status === "second") return half === "first" ? "green" : "red";
  if (status === "mfirst") {
    if (isPowerOff(prevStatus || "")) return half === "first" ? "red" : "green";
    return half === "first" ? "green" : "red";
  }
  if (status === "msecond") {
    if (isPowerOff(nextStatus || "")) return half === "first" ? "green" : "red";
    return half === "first" ? "red" : "green";
  }
  if (status === "maybe") return "red";
  if (status === "yes") return "green";
  if (status === "no") return "red";
  return "green";
};

const formatDate = (date: Date): string => {
  const months = [
    "січня",
    "лютого",
    "березня",
    "квітня",
    "травня",
    "червня",
    "липня",
    "серпня",
    "вересня",
    "жовтня",
    "листопада",
    "грудня",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

const getDateForTab = (tab: DayTab): string => {
  const now = new Date();
  const kyivTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" }),
  );

  if (tab === "tomorrow") {
    kyivTime.setDate(kyivTime.getDate() + 1);
  }

  return formatDate(kyivTime);
};

interface ScheduleDialProps {
  queueKey: string;
  schedule: ScheduleData;
  centerLabel?: string;
}

export const ScheduleDial = ({
  queueKey,
  schedule,
  centerLabel,
}: ScheduleDialProps) => {
  const [activeTab, setActiveTab] = useState<DayTab>("today");

  const dayKey = activeTab === "today" ? "1" : "2";
  const dayStatus = schedule.preset.day_status?.[dayKey];
  const dayName = schedule.preset.days[dayKey];
  const dateStr = getDateForTab(activeTab);

  const queueData = schedule.preset.data[queueKey]?.[dayKey];

  const hourKeys = Object.keys(schedule.preset.time_zone);

  // 48 сегментів (по 30 хв)
  const totalSegments = 48;
  const segmentAngle = 360 / totalSegments;

  // Розміри
  const size = 500;
  const center = size / 2;
  const outerRadius = 200;
  const innerRadius = 120;

  // Зсув, щоб 00:00 був зверху
  const START_OFFSET = -90;

  const getPoint = (angle: number, radius: number) => {
    const rad = ((angle + START_OFFSET) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  // Генеруємо сектор
  const getSectorPath = (startAngle: number, endAngle: number): string => {
    const p1 = getPoint(startAngle, outerRadius);
    const p2 = getPoint(endAngle, outerRadius);
    const p3 = getPoint(endAngle, innerRadius);
    const p4 = getPoint(startAngle, innerRadius);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
    M ${p1.x} ${p1.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${p2.x} ${p2.y}
    L ${p3.x} ${p3.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${p4.x} ${p4.y}
    Z
  `;
  };

  // Колір для сегмента
  const getSegmentColor = (segmentIndex: number): string => {
    const hourIndex = Math.floor(segmentIndex / 2);
    const half = segmentIndex % 2 === 0 ? "first" : "second";
    const hourKey = hourKeys[hourIndex];

    if (!hourKey) return "green";

    const status = (queueData?.[hourKey] || "no") as string;
    const prevHourKey = hourKeys[hourIndex - 1];
    const nextHourKey = hourKeys[hourIndex + 1];
    const prevStatus = prevHourKey
      ? (queueData?.[prevHourKey] as string)
      : null;
    const nextStatus = nextHourKey
      ? (queueData?.[nextHourKey] as string)
      : null;

    return getHalfColor(status, half, prevStatus, nextStatus);
  };

  const colorToFill = (color: string): string => {
    return color === "red" ? "#cc6f6f" : "#a4edc4";
  };

  // Визначаємо, що показувати в центрі
  const label = centerLabel || formatQueueName(queueKey);
  const labelFontSize = label.length > 20 ? "20px" : "28px";

  return (
    <div className={styles.dial}>
      <div className={styles.dial__header}>
        <div className={styles.dial__dateWrapper}>
          <div className={styles.dial__date}>
            <span className={styles.dial__icon}>📅</span>
            {dayName}, {dateStr} — {formatQueueName(queueKey)}
          </div>
          <div className={styles.dial__updated}>
            <span className={styles.dial__updatedDot}></span>
            Оновлено: {schedule.fact.update}
          </div>
        </div>

        <div className={styles.dial__tabs}>
          <button
            className={`${styles.dial__tab} ${
              activeTab === "today" ? styles.dial__tab_active : ""
            }`}
            onClick={() => setActiveTab("today")}
          >
            Сьогодні
          </button>
          <button
            className={`${styles.dial__tab} ${
              activeTab === "tomorrow" ? styles.dial__tab_active : ""
            }`}
            onClick={() => setActiveTab("tomorrow")}
          >
            Завтра
          </button>
        </div>
      </div>

      {dayStatus === "WaitingForSchedule" ? (
        <div className={styles.dial__placeholder}>
          Графік на завтра ще не опубліковано
        </div>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={styles.dial__svg}
        >
          {/* 48 сегментів */}
         {/* 48 сегментів */}
{Array.from({ length: totalSegments }).map((_, index) => {
  const startAngle = index * segmentAngle;
  const endAngle = (index + 1) * segmentAngle;
  const color = getSegmentColor(index);
  const path = getSectorPath(startAngle, endAngle);

  return (
    <path
      key={index}
      d={path}
      fill={colorToFill(color)}
      stroke="var(--bg-card)"
      strokeWidth="1"
    />
  );
})}

          {/* Мітки годин */}
          {hourKeys.map((hourKey, index) => {
            // Мітка на початку години
            const angle = index * segmentAngle * 2;
            const point = getPoint(angle, outerRadius + 25);

            // Форматуємо: 0 → 00, 1 → 01, ..., 23 → 23
            const timeLabel = String(index).padStart(2, "0");

            return (
              <text
                key={`label-${hourKey}`}
                x={point.x}
                y={point.y}
                dy="0.35em"
                fontSize="14px"
                fontWeight="700"
                textAnchor="middle"
                fill="var(--text-primary)"
              >
                {timeLabel}
              </text>
            );
          })}

          {/* Центральний текст — два рядки */}
        {/* Центральний текст */}
{label.includes(",") ? (
  <>
    <text
      x={center}
      y={center - 25}
      dy="0.35em"
      fontSize={label.split(",")[0].length > 25 ? "10px" : label.split(",")[0].length > 18 ? "12px" : "14px"}
      fontWeight="700"
      textAnchor="middle"
      fill="var(--text-primary)"
    >
      {label.split(",")[0]}
    </text>
    <text
      x={center}
      y={center}
      dy="0.35em"
      fontSize="16px"
      fontWeight="700"
      textAnchor="middle"
      fill="var(--text-primary)"
    >
      {label.split(",").slice(1).join(",").trim()}
    </text>
  </>
) : (
  <text
    x={center}
    y={center - 10}
    dy="0.35em"
    fontSize={label.length > 25 ? "16px" : "22px"}
    fontWeight="700"
    textAnchor="middle"
    fill="var(--text-primary)"
  >
    {label}
  </text>
)}
<text
  x={center}
  y={center + 30}
  dy="0.35em"
  fontSize="13px"
  textAnchor="middle"
  fill="var(--text-secondary)"
>
  {dateStr}
</text>
        </svg>
      )}

      <div className={styles.dial__legend}>
        <div className={styles.dial__legendItem}>
          <span
            className={`${styles.dial__legendDot} ${styles.dial__legendDot_green}`}
          ></span>
          Світло є
        </div>
        <div className={styles.dial__legendItem}>
          <span
            className={`${styles.dial__legendDot} ${styles.dial__legendDot_red}`}
          ></span>
          Світла немає
        </div>
      </div>
    </div>
  );
};
