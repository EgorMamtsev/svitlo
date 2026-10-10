// src/utils/scheduleUtils.ts
import type { ScheduleData, StatusType } from "../api/types";

// Отримуємо поточну годину за КИЇВСЬКИМ часом (0-23)
export const getCurrentHour = (): number => {
  const now = new Date();
  const kyivTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" }),
  );
  return kyivTime.getHours();
};

// Отримуємо поточну хвилину за КИЇВСЬКИМ часом (0-59)
export const getCurrentMinute = (): number => {
  const now = new Date();
  const kyivTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" }),
  );
  return kyivTime.getMinutes();
};

// Форматуємо час: якщо хвилини 60 — це наступна година
const formatTime = (hour: number, minute: number): string => {
  if (minute === 60) {
    return `${String(hour).padStart(2, "0")}:00`;
  }
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

// Визначаємо, чи є світло зараз
export const isPowerOnNow = (
  schedule: ScheduleData,
  queueKey: string,
  dayKey: string,
): boolean => {
  const queueData = schedule.preset.data[queueKey]?.[dayKey];
  if (!queueData) return false;

  const currentHour = getCurrentHour();
  const currentMinute = getCurrentMinute();

  const hourKey = String(currentHour + 1);
  const status = queueData[hourKey] as StatusType | undefined;

  if (!status) return false;

  const isFirstHalf = currentMinute < 30;

  if (status === "first") return !isFirstHalf;
  if (status === "mfirst") return !isFirstHalf;
  if (status === "second") return isFirstHalf;
  if (status === "msecond") return !isFirstHalf;

  return status === "yes" || status === "maybe";
};

// Знаходимо поточне відключення (якщо зараз відключення)
export const findCurrentOutage = (
  schedule: ScheduleData,
  queueKey: string,
  dayKey: string,
): { start: string; end: string } | null => {
  const queueData = schedule.preset.data[queueKey]?.[dayKey];
  if (!queueData) return null;

  const currentHour = getCurrentHour();
  const currentMinute = getCurrentMinute();

  const hourKey = String(currentHour + 1);
  const status = queueData[hourKey] as StatusType | undefined;

  if (!status) return null;

  const isFirstHalf = currentMinute < 30;

  let isDark = false;
  if (status === "no") isDark = true;
  if (status === "first" && isFirstHalf) isDark = true;
  if (status === "mfirst" && isFirstHalf) isDark = true;
  if (status === "second" && !isFirstHalf) isDark = true;
  if (status === "msecond" && !isFirstHalf) isDark = true;

  if (!isDark) return null;

  // Шукаємо початок відключення (назад)
  let startHour = currentHour;
  let startMinute = 0;

  for (let h = currentHour; h >= 0; h--) {
    const hourKey2 = String(h + 1);
    const status2 = queueData[hourKey2] as StatusType | undefined;

    if (!status2) break;

    if (status2 === "yes" || status2 === "maybe") {
      startHour = h + 1;
      startMinute = 0;
      break;
    }

    if (h < currentHour) {
      if (status2 === "second" || status2 === "msecond") {
        startHour = h;
        startMinute = 30;
      } else {
        startHour = h;
        startMinute = 0;
      }
    }

    if (h === 0) {
      startHour = 0;
      startMinute = 0;
    }
  }

  // Шукаємо кінець відключення (вперед)
  let endHour = currentHour;
  let endMinute = 60;

  for (let h = currentHour; h < 24; h++) {
    const hourKey2 = String(h + 1);
    const status2 = queueData[hourKey2] as StatusType | undefined;

    if (!status2) break;

    if (status2 === "yes" || status2 === "maybe") {
      endHour = h;
      endMinute = 0;
      break;
    }

    if (status2 === "first" || status2 === "mfirst") {
      endHour = h;
      endMinute = 0;
      break;
    }

    endHour = h + 1;
    endMinute = 60;
  }

  return {
    start: formatTime(startHour, startMinute),
    end: formatTime(endHour, endMinute),
  };
};

// Знаходимо наступне відключення (якщо зараз світло)
export const findNextOutage = (
  schedule: ScheduleData,
  queueKey: string,
  dayKey: string,
): { start: string; end: string } | null => {
  const queueData = schedule.preset.data[queueKey]?.[dayKey];
  if (!queueData) return null;

  const currentHour = getCurrentHour();
  const currentMinute = getCurrentMinute();

  // Якщо зараз відключення — наступного немає
  const currentStatus = queueData[String(currentHour + 1)] as
    | StatusType
    | undefined;
  if (currentStatus) {
    const isFirstHalf = currentMinute < 30;
    let isDark = false;
    if (currentStatus === "no") isDark = true;
    if (currentStatus === "first" && isFirstHalf) isDark = true;
    if (currentStatus === "mfirst" && isFirstHalf) isDark = true;
    if (currentStatus === "second" && !isFirstHalf) isDark = true;
    if (currentStatus === "msecond" && !isFirstHalf) isDark = true;
    if (isDark) return null;
  }

  for (let h = currentHour; h < 24; h++) {
    const hourKey = String(h + 1);
    const status = queueData[hourKey] as StatusType | undefined;

    if (!status) continue;

    const isDarkStart =
      status === "no" ||
      status === "first" ||
      status === "mfirst" ||
      status === "second" ||
      status === "msecond";

    if (isDarkStart) {
      const startHour = h;
      const startMinute = status === "second" || status === "msecond" ? 30 : 0;

      let endHour = h;
      let endMinute = 60;

      for (let h2 = h; h2 < 24; h2++) {
        const hourKey2 = String(h2 + 1);
        const status2 = queueData[hourKey2] as StatusType | undefined;

        if (!status2) break;

        if (status2 === "yes" || status2 === "maybe") {
          endHour = h2;
          endMinute = 0;
          break;
        }

        if (status2 === "first" || status2 === "mfirst") {
          endHour = h2;
          endMinute = 0;
          break;
        }

        endHour = h2 + 1;
        endMinute = 60;
      }

      return {
        start: formatTime(startHour, startMinute),
        end: formatTime(endHour, endMinute),
      };
    }
  }

  return null;
};

// Підраховуємо статистику за день
export const calculateStats = (
  schedule: ScheduleData,
  queueKey: string,
  dayKey: string,
): { onHours: number; offHours: number } => {
  const queueData = schedule.preset.data[queueKey]?.[dayKey];
  if (!queueData) return { onHours: 0, offHours: 0 };

  let onHours = 0;
  let offHours = 0;

  for (let h = 1; h <= 24; h++) {
    const status = queueData[String(h)] as StatusType | undefined;
    if (!status) continue;

    switch (status) {
      case "yes":
      case "maybe":
        onHours += 1;
        break;

      case "no":
        offHours += 1;
        break;

      case "first":
      case "mfirst":
        offHours += 0.5;
        onHours += 0.5;
        break;

      case "second":
      case "msecond":
        onHours += 0.5;
        offHours += 0.5;
        break;

      default:
        onHours += 1;
    }
  }

  return { onHours, offHours };
};
