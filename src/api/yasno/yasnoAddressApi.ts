// src/api/yasno/yasnoAddressApi.ts

const API_BASE = 'http://localhost:3001/api/yasno';

// Yasno повертає "value" замість "name"
export interface Street {
  id: number;
  value: string;
}

export interface House {
  id: number;
  value: string;
}

export interface GroupInfo {
  group: number;
  subgroup: number;
}

// Пошук вулиць
export const fetchStreets = async (
  regionId: number,
  dsoId: number,
  query: string
): Promise<Street[]> => {
  try {
    const url = `${API_BASE}/streets?regionId=${regionId}&dsoId=${dsoId}&query=${encodeURIComponent(query)}`;
    console.log('fetchStreets URL:', url);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Помилка: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Не вдалося знайти вулиці:', error);
    return [];
  }
};

// Пошук будинків
export const fetchHouses = async (
  regionId: number,
  dsoId: number,
  streetId: number,
  query: string
): Promise<House[]> => {
  try {
    const url = `${API_BASE}/houses?regionId=${regionId}&dsoId=${dsoId}&streetId=${streetId}&query=${encodeURIComponent(query)}`;
    console.log('fetchHouses URL:', url);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Помилка: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Не вдалося знайти будинки:', error);
    return [];
  }
};

// Визначення групи за адресою
export const fetchGroup = async (
  regionId: number,
  streetId: number,
  houseId: number,
  dsoId: number
): Promise<GroupInfo | null> => {
  try {
    const url = `${API_BASE}/group?regionId=${regionId}&streetId=${streetId}&houseId=${houseId}&dsoId=${dsoId}`;
    console.log('fetchGroup URL:', url);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Помилка: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Не вдалося визначити групу:', error);
    return null;
  }
};