// src/components/ScheduleDial/ScheduleDial.tsx
import styles from "./ScheduleDial.module.scss";
import type { ScheduleData } from "../../api/types";
import { splitStatus } from "../../api/types";

const isPowerOff = (status: string): boolean => {
  return status === "no" || status === "first" || status === "second";
};

interface ScheduleDialProps {
  queueKey: string;
  schedule: ScheduleData;
  dayKey: string;
}

export const ScheduleDial = ({ queueKey, schedule, dayKey }: ScheduleDialProps) => {
  const dayStatus = schedule.preset.day_status?.[dayKey];
  const queueData = schedule.preset.data[queueKey]?.[dayKey];

  if (dayStatus === "WaitingForSchedule") {
    return (
      <div className={styles.dial}>
        <div className={styles.dial__placeholder}>
          Графік на завтра ще не опубліковано
        </div>
      </div>
    );
  }

  if (!queueData) {
    return <div className={styles.dial}>Немає даних для цієї черги.</div>;
  }

  const allKeys = Object.keys(schedule.preset.time_zone);
  const hourKeys = allKeys.filter((key) => !key.includes("."));

  const queueName = schedule.preset.sch_names[queueKey] || queueKey;
  const dayName = schedule.preset.days[dayKey];

  const size = 450;
  const center = size / 2;
  const outerRadius = 200;
  const innerRadius = 80;
  const segmentAngle = 360 / hourKeys.length;

  const getSegmentPath = (index: number) => {
    const startAngle = index * segmentAngle - 90;
    const endAngle = (index + 1) * segmentAngle - 90;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + outerRadius * Math.cos(startRad);
    const y1 = center + outerRadius * Math.sin(startRad);
    const x2 = center + outerRadius * Math.cos(endRad);
    const y2 = center + outerRadius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const largeArc = segmentAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  };

  const getHourLabelPosition = (index: number) => {
    const angle = index * segmentAngle + segmentAngle / 2 - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = (outerRadius + innerRadius) / 2;

    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  let onCount = 0;
  let offCount = 0;
  hourKeys.forEach((hourKey) => {
    const status = queueData[hourKey] || "no";
    const [firstHalf, secondHalf] = splitStatus(status);
    if (isPowerOff(firstHalf)) offCount += 0.5;
    else onCount += 0.5;
    if (isPowerOff(secondHalf)) offCount += 0.5;
    else onCount += 0.5;
  });

  return (
    <div className={styles.dial}>
      <h3 className={styles.dial__title}>
        {dayName}, {queueName}
      </h3>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.dial__svg}
      >
        {hourKeys.map((hourKey, index) => {
          const status = queueData[hourKey] || "no";
          const [firstHalf, secondHalf] = splitStatus(status);
          const path = getSegmentPath(index);
          const labelPos = getHourLabelPosition(index);

          return (
            <g key={hourKey}>
              <path
                d={path}
                className={`${styles.dial__segment} ${
                  isPowerOff(firstHalf) ? styles.dial__segment_off : styles.dial__segment_on
                }`}
              />
              {/* Внутрішня половина (другі 30 хв) */}
              <path
                d={path}
                className={`${styles.dial__segmentInner} ${
                  isPowerOff(secondHalf) ? styles.dial__segment_off : styles.dial__segment_on
                }`}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                className={styles.dial__hourLabel}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {index}
              </text>
            </g>
          );
        })}

        <text
          x={center}
          y={center - 30}
          className={styles.dial__centerText}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {queueName}
        </text>
        <text
          x={center}
          y={center + 5}
          className={styles.dial__centerSubtext}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {dayName}
        </text>
        <text
          x={center}
          y={center + 40}
          className={styles.dial__centerStats}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <tspan className={styles.dial__statsOff}>-{offCount}</tspan>
          <tspan> </tspan>
          <tspan className={styles.dial__statsOn}>+{onCount}</tspan>
        </text>
      </svg>
    </div>
  );
};