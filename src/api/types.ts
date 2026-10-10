// src/api/types.ts

export type StatusType =
  | "yes"
  | "no"
  | "maybe"
  | "mfirst"
  | "msecond"
  | "first"
  | "second";

export type DayStatus =
  | "EmergencyShutdowns"
  | "NoOutages"
  | "WaitingForSchedule"
  | "PlannedOutages"
  | "PossibleOutages";

export interface QueueDaySchedule {
  [hour: string]: StatusType;
}

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
    days: { [day: string]: string };
    data: { [queueKey: string]: QueueData };
    time_zone: { [hour: string]: string[] };
    sch_names: { [queueKey: string]: string };
    time_type: { [status: string]: string };
    day_status: { [day: string]: DayStatus };
    day_dates: { [day: string]: string }; // ← ДОДАНО
  };
}

/**
 * Розбиває статус години на два півгодинні статуси.
 */
export const splitStatus = (status: StatusType): [StatusType, StatusType] => {
  switch (status) {
    case "first":
      return ["no", "yes"];
    case "second":
      return ["yes", "no"];
    case "mfirst":
      return ["maybe", "yes"];
    case "msecond":
      return ["yes", "maybe"];
    default:
      return [status, status];
  }
};