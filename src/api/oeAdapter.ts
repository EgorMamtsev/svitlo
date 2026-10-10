// src/api/oeAdapter.ts
import type { ScheduleData, StatusType, DayStatus } from './types';
import type { OEData } from './oeApi';

export interface AdaptedOESchedule {
  schedule: ScheduleData;
  isEmergency: boolean;
  emergencyReason: string | null;
}

export const adaptOEData = (
  oeData: OEData,
  regionName: string
): AdaptedOESchedule => {
  const timestamps = Object.keys(oeData.fact.data);
  const todayTimestamp = String(oeData.fact.today);

  const todayIndex = timestamps.indexOf(todayTimestamp);
  const todayData = oeData.fact.data[todayTimestamp];
  const tomorrowTimestamp = timestamps[todayIndex + 1] || timestamps[0];
  const tomorrowData = oeData.fact.data[tomorrowTimestamp];

  const data: Record<string, Record<string, Record<string, StatusType>>> = {};
  const schNames: Record<string, string> = {};

  Object.keys(todayData).forEach((queueKey) => {
    schNames[queueKey] = `Черга ${queueKey}`;
    data[queueKey] = {
      '1': todayData[queueKey] as Record<string, StatusType>,
      '2': (tomorrowData?.[queueKey] as Record<string, StatusType>) || (todayData[queueKey] as Record<string, StatusType>),
    };
  });

  const days: Record<string, string> = {
    '1': 'Сьогодні',
    '2': 'Завтра',
  };

  const dayStatus: Record<string, DayStatus> = {
    '1': 'PlannedOutages',
    '2': 'PlannedOutages',
  };

  // Для OE-областей ми не маємо інформації про аварійні відключення
  const isEmergency = false;
  const emergencyReason = null;

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
      },
    },
    isEmergency,
    emergencyReason,
  };
};