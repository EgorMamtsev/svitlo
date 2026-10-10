// src/api/oeApi.ts

const API_BASE = 'http://localhost:3001/api/oe';

export interface OEData {
  regionId: string;
  lastUpdated: string;
  fact: {
    data: {
      [timestamp: string]: {
        [queueKey: string]: {
          [hour: string]: string;
        };
      };
    };
    update: string;
    today: number;
  };
  preset: {
    time_zone: {
      [hour: string]: [string, string, string];
    };
    time_type: {
      [status: string]: string;
    };
  };
}

export const fetchOEData = async (fileName: string): Promise<OEData | null> => {
  try {
    const response = await fetch(`${API_BASE}/${fileName}`);
    if (!response.ok) throw new Error(`Помилка: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Не вдалося отримати OE дані:', error);
    return null;
  }
};