// src/api/scheduleApi.ts

const API_BASE = "http://localhost:3001/api";

// Статуси, які ми бачили в time_type
export type StatusType =
  | "yes"
  | "no"
  | "maybe"
  | "mfirst"
  | "msecond"
  | "first"
  | "second";

// Розклад для однієї черги на один день
// Ключі — це години ("1", "2", ..., "24"), значення — статус
export interface QueueDaySchedule {
  [hour: string]: StatusType;
}

// Дані для однієї черги (наприклад, "ГПВ1.1")
// Ключі — це дні тижня ("1", "2", ..., "7")
export interface QueueData {
  [day: string]: QueueDaySchedule;
}

export interface ScheduleData {
  regionId: string;
  regionAffiliation: string;
  fact: {
    data: any[];
    update: string;
  };
  preset: {
    // Словник назв днів: { "1": "Понеділок", ... }
    days: { [day: string]: string };
    // Словник даних по чергах: { "ГПВ1.1": { "1": { "1": "yes", ... }, ... }, ... }
    data: { [queueKey: string]: QueueData };
    // Словник перекладу годин: { "1": ["00-01", "00:00", "01:00"], ... }
    time_zone: { [hour: string]: string[] };
    // Словник назв черг: { "ГПВ1.1": "Черга 1.1", ... }
    sch_names: { [queueKey: string]: string };
    // Словник перекладу статусів: { "yes": "Світло є", ... }
    time_type: { [status: string]: string };
  };
}

export const fetchSchedule = async (
  regionId: string,
): Promise<ScheduleData | null> => {
  try {
    const url = `${API_BASE}/schedule/${regionId}`;
    console.log("Завантажую дані з:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Помилка мережі: ${response.status}`);
    }

    const data: ScheduleData = await response.json();
    console.log("Дані успішно завантажено:", data);
    return data;
  } catch (error) {
    console.error(`Не вдалося завантажити графік для ${regionId}:`, error);
    return null;
  }
};
