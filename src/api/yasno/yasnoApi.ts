// src/api/yasno/yasnoApi.ts
const API_BASE = 'http://localhost:3001/api/yasno';

export interface Dso {
  id: number;
  name: string;
}

export interface Region {
  id: number;
  value: string;
  hasCities: boolean;
  dsos: Dso[];
}

// ОНОВЛЕНО: start та end — числа (хвилини)
export interface OutageSlot {
  start: number;
  end: number;
  type: string; // "Definite" | "NotPlanned"
}

export interface OutageDay {
  date: string;
  status: string;
  slots: OutageSlot[];
}

export interface QueueOutages {
  today: OutageDay;
  tomorrow: OutageDay;
  updatedOn: string;
}

export interface PlannedOutages {
  [queueKey: string]: QueueOutages;
}

export const fetchPlannedOutages = async (
  regionId: number,
  dsoId: number
): Promise<PlannedOutages | null> => {
  try {
    const response = await fetch(`${API_BASE}/planned-outages/${regionId}/${dsoId}`);
    if (!response.ok) throw new Error(`Помилка: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Не вдалося отримати графік:', error);
    return null;
  }
};