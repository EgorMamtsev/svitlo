// src/api/oe/oeBase.ts
import type { ScheduleData, StatusType, DayStatus } from '../types';
import type { OEData } from './oeApi';

export interface AdaptedOESchedule {
  schedule: ScheduleData;
  isEmergency: boolean;
  emergencyReason: string | null;
}

export const formatDate = (date: Date): string => {
  const months = [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

/**
 * Базова функція для адаптації OE-даних.
 * Кожна область може перевизначити її, якщо формат зміниться.
 */
export const adaptOEBase = (
  oeData: OEData,
  regionName: string
): AdaptedOESchedule => {
  const timestamps = Object.keys(oeData.fact.data);
  const todayTimestamp = String(oeData.fact.today);

  const todayIndex = timestamps.indexOf(todayTimestamp);
  const todayData = oeData.fact.data[todayTimestamp];
  const tomorrowTimestamp = timestamps[todayIndex + 1];
  const tomorrowData = tomorrowTimestamp
    ? oeData.fact.data[tomorrowTimestamp]
    : null;

  const hasTomorrowData =
    !!tomorrowData && Object.keys(tomorrowData).length > 0;

  // Перевіряємо, чи fact.today = реальна київська дата
  const kyivNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Kyiv" })
  );
  const todayDate = new Date(Number(todayTimestamp) * 1000);

  const isTodayActual =
    todayDate.toDateString() === kyivNow.toDateString();

  const days: Record<string, string> = {
    '1': isTodayActual ? 'Сьогодні' : 'Завтра',
    '2': isTodayActual ? 'Завтра' : 'Післязавтра',
  };

  const data: Record<string, Record<string, Record<string, StatusType>>> = {};
  const schNames: Record<string, string> = {};

  Object.keys(todayData).forEach((queueKey) => {
    schNames[queueKey] = `Черга ${queueKey}`;
    data[queueKey] = {
      '1': todayData[queueKey] as Record<string, StatusType>,
      '2': hasTomorrowData
        ? (tomorrowData![queueKey] as Record<string, StatusType>)
        : (todayData[queueKey] as Record<string, StatusType>),
    };
  });

  const dayStatus: Record<string, DayStatus> = {
    '1': 'PlannedOutages',
    '2': hasTomorrowData ? 'PlannedOutages' : 'WaitingForSchedule',
  };

  const dayDates: Record<string, string> = {
    '1': formatDate(todayDate),
    '2': hasTomorrowData
      ? formatDate(new Date(Number(tomorrowTimestamp!) * 1000))
      : formatDate(new Date(todayDate.getTime() + 86400000)),
  };

  return {
    schedule: {
      regionId: oeData.regionId,
      regionAffiliation: regionName,
      fact: {
        data: [],
        update: oeData.fact.update,
      },
      preset: {
        days,
        data,
        time_zone: oeData.preset.time_zone,
        sch_names: schNames,
        time_type: oeData.preset.time_type,
        day_status: dayStatus,
        day_dates: dayDates,
      },
    },
    isEmergency: false,
    emergencyReason: null,
  };
};