// src/api/yasno/yasnoAdapter.ts
import type { ScheduleData, StatusType, DayStatus } from "../types";
import type { PlannedOutages, OutageSlot } from "../yasno/yasnoApi";

// Перевіряємо, чи є слот активним у певний проміжок часу (у хвилинах)
const isSlotActive = (
  slots: OutageSlot[],
  startMinute: number,
  endMinute: number,
): boolean => {
  return slots.some((slot) => {
    // Слот "Definite" означає, що світла немає
    if (slot.type !== "Definite") return false;
    return slot.start < endMinute && slot.end > startMinute;
  });
};

export interface AdaptedSchedule {
  schedule: ScheduleData;
  isEmergency: boolean;
  emergencyReason: string | null;
}

export const adaptYasnoData = (
  plannedOutages: PlannedOutages,
  regionId: number,
  dsoId: number,
  regionName: string,
  dsoName: string,
): AdaptedSchedule => {
  const timeZone: Record<string, string[]> = {};
  const data: Record<string, Record<string, Record<string, StatusType>>> = {};
  const schNames: Record<string, string> = {};

  // Генеруємо time_zone для 24 годин
  for (let h = 0; h < 24; h++) {
    const start = `${String(h).padStart(2, "0")}:00`;
    const end = `${String(h + 1).padStart(2, "0")}:00`;
    timeZone[String(h + 1)] = [`${start}-${end}`, start, end];
  }

  // Обробляємо кожну чергу
  Object.keys(plannedOutages).forEach((queueKey) => {
    const queueData = plannedOutages[queueKey];
    schNames[queueKey] = `Черга ${queueKey}`;
    data[queueKey] = {};

    const days: Array<{ dayKey: string; day: typeof queueData.today }> = [
      { dayKey: "1", day: queueData.today },
      { dayKey: "2", day: queueData.tomorrow },
    ];

    days.forEach(({ dayKey, day }) => {
      data[queueKey][dayKey] = {};

      if (day.status === "EmergencyShutdowns") {
        // Аварійні відключення — всі години червоні
        for (let h = 1; h <= 24; h++) {
          data[queueKey][dayKey][String(h)] = "no";
        }
      } else if (
        day.status === "NoOutages" ||
        day.status === "WaitingForSchedule"
      ) {
        // Немає відключень — всі години зелені
        for (let h = 1; h <= 24; h++) {
          data[queueKey][dayKey][String(h)] = "yes";
        }
      } else if (day.slots.length === 0) {
        // Якщо слотів немає — вважаємо, що відключень немає
        for (let h = 1; h <= 24; h++) {
          data[queueKey][dayKey][String(h)] = "yes";
        }
      } else {
        // Перевіряємо кожну годину (в хвилинах)
        for (let h = 0; h < 24; h++) {
          const startMinute = h * 60;
          const endMinute = (h + 1) * 60;
          const isActive = isSlotActive(day.slots, startMinute, endMinute);
          data[queueKey][dayKey][String(h + 1)] = isActive ? "no" : "yes";
        }
      }
    });
  });

  const days: Record<string, string> = {
    "1": "Сьогодні",
    "2": "Завтра",
    "3": "Середа",
    "4": "Четвер",
    "5": "П'ятниця",
    "6": "Субота",
    "7": "Неділя",
  };

  const timeType: Record<string, string> = {
    yes: "Світло є",
    no: "Світла немає",
  };

  const firstQueueKey = Object.keys(plannedOutages)[0];
  const firstQueue = plannedOutages[firstQueueKey];

  // Визначаємо статус дня
  const dayStatus: Record<string, DayStatus> = {
    "1": (firstQueue?.today?.status as DayStatus) || "NoOutages",
    "2": (firstQueue?.tomorrow?.status as DayStatus) || "NoOutages",
  };

  const isEmergency =
    dayStatus["1"] === "EmergencyShutdowns" ||
    dayStatus["2"] === "EmergencyShutdowns";

  let emergencyReason: string | null = null;
  if (isEmergency) {
    emergencyReason = "Діють аварійні відключення. Графік може не діяти.";
  }

  return {
    schedule: {
      regionId: String(regionId),
      regionAffiliation: regionName,
      fact: {
        data: [],
        update: firstQueue?.updatedOn || new Date().toISOString(),
      },
      preset: {
        days,
        data,
        time_zone: timeZone,
        sch_names: schNames,
        time_type: timeType,
        day_status: dayStatus,
      },
    },
    isEmergency,
    emergencyReason,
  };
};
