import { adaptOEBase } from './oeBase';
import type { AdaptedOESchedule } from './oeBase';
import type { OEData } from './oeApi';

export const adaptPoltava = (
  oeData: OEData,
  regionName: string
): AdaptedOESchedule => {
  // Полтава використовує базовий формат
  return adaptOEBase(oeData, regionName);
};